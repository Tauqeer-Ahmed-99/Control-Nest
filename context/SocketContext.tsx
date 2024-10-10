import useMobileStorageData from "@/hooks/useMobileStorageData";
import { ApiRoutes } from "@/routes/routes";
import { SocketEvent } from "@/utils/models";
import { useUser } from "@clerk/clerk-expo";
import { useQueryClient } from "@tanstack/react-query";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { ToastAndroid } from "react-native";

type SocketContextType = {
  socket: WebSocket | null;
  isConnected: boolean;
  notifications: Notification[];
};

interface SocketEventData<T = any> {
  event: SocketEvent;
  user_id: string;
  message: string;
  data: T;
}

type Notification = {
  id: string;
  date: Date;
} & SocketEventData;

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  notifications: [],
});

export const useSocket = () => useContext(SocketContext);

export const useSocketNotifications = () => useSocket().notifications;

const SocketProvider = ({ children }: PropsWithChildren) => {
  const { data: controllerDeviceUrl } = useMobileStorageData(
    "controller-device-url",
  );
  const { user } = useUser();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const queryClient = useQueryClient();

  const handleSocketEventData = (data: SocketEventData) => {
    const timetamp = new Date();
    const newNotification: Notification = {
      id: `${data.user_id};${timetamp.toISOString()};${data.message}`,
      message: data.message,
      user_id: data.user_id,
      date: timetamp,
      event: data.event,
      data: data.data,
    };

    setNotifications((prevNotifs) => [newNotification, ...prevNotifs]);

    if (user?.id === data.user_id || data.event === SocketEvent.USER_LEFT)
      return;

    ToastAndroid.showWithGravity(
      data.message,
      ToastAndroid.LONG,
      ToastAndroid.TOP,
    );

    queryClient.invalidateQueries({ queryKey: [ApiRoutes.UserHouse] });

    // switch (data.event) {
    //   case SocketEvent.ADD_ROOM:
    //     const addRoomEventData: SocketEventData<Room> = data;
    //     const room = addRoomEventData.data;
    //     queryClient.setQueryData(
    //       [ApiRoutes.UserHouse],
    //       (oldData: UserHouseResponse) => {
    //         return {
    //           ...oldData,
    //           data: {
    //             ...oldData.data,
    //             rooms: [...oldData.data.rooms, room],
    //           },
    //         } as UserHouseResponse;
    //       },
    //     );
    //     break;
    //   case SocketEvent.REMOVE_ROOM:
    //     const removeRoomEventData: SocketEventData<{ roomId: string }> = data;
    //     const roomId = removeRoomEventData.data.roomId;
    //     queryClient.setQueryData(
    //       [ApiRoutes.UserHouse],
    //       (oldData: UserHouseResponse) => {
    //         return {
    //           ...oldData,
    //           data: {
    //             ...oldData.data,
    //             rooms: oldData.data.rooms.filter(
    //               (room) => room.room_id !== roomId,
    //             ),
    //           },
    //         } as UserHouseResponse;
    //       },
    //     );
    //     break;
    //   case SocketEvent.ADD_DEVICE:
    //     const addDeviceEventData: SocketEventData<Device> = data;
    //     const device = addDeviceEventData.data;
    //     queryClient.setQueryData(
    //       [ApiRoutes.UserHouse],
    //       (oldData: UserHouseResponse) => {
    //         return {
    //           ...oldData,
    //           data: {
    //             ...oldData.data,
    //             rooms: oldData.data.rooms.map((room) =>
    //               room.room_id === device.room_id
    //                 ? { ...room, devices: [...room.devices, device] }
    //                 : room,
    //             ),
    //           },
    //         } as UserHouseResponse;
    //       },
    //     );
    //     break;
    //   case SocketEvent.SWITCH_DEVICE:
    //     const switchDeviceEventData: SocketEventData<{
    //       deviceId: string;
    //       status: boolean;
    //     }> = data;
    //     const deviceData = switchDeviceEventData.data;
    //     queryClient.setQueryData(
    //       [ApiRoutes.UserHouse],
    //       (oldData: UserHouseResponse) => {
    //         const room = oldData.data.rooms.find((room) =>
    //           room.devices.some(
    //             (device) => device.device_id === deviceData.deviceId,
    //           ),
    //         );
    //         return {
    //           ...oldData,
    //           data: {
    //             ...oldData.data,
    //             rooms: oldData.data.rooms.map((_room) =>
    //               _room.room_id === room?.room_id
    //                 ? {
    //                     ..._room,
    //                     devices: _room.devices.map((_device) =>
    //                       _device.device_id === deviceData.deviceId
    //                         ? { ..._device, status: deviceData.status }
    //                         : _device,
    //                     ),
    //                   }
    //                 : _room,
    //             ),
    //           },
    //         } as UserHouseResponse;
    //       },
    //     );
    //     break;
    //   case SocketEvent.CONFIGURE_DEVICE:
    //     const configureDeviceEventData: SocketEventData<Device> = data;
    //     const configuredDevice = configureDeviceEventData.data;
    //     queryClient.setQueryData(
    //       [ApiRoutes.UserHouse],
    //       (oldData: UserHouseResponse) => {
    //         const room = oldData.data.rooms.find((room) =>
    //           room.devices.some(
    //             (device) => device.device_id === configuredDevice.device_id,
    //           ),
    //         );
    //         return {
    //           ...oldData,
    //           data: {
    //             ...oldData.data,
    //             rooms: oldData.data.rooms.map((_room) =>
    //               _room.room_id === room?.room_id
    //                 ? {
    //                     ..._room,
    //                     devices: _room.devices.map((_device) =>
    //                       _device.device_id === deviceData.deviceId
    //                         ? configuredDevice
    //                         : _device,
    //                     ),
    //                   }
    //                 : _room,
    //             ),
    //           },
    //         } as UserHouseResponse;
    //       },
    //     );
    //     break;
    //   case SocketEvent.REMOVE_DEVICE:
    //     const removeDeviceEventData: SocketEventData<{ deviceId: string }> =
    //       data;
    //     const removeDeviceData = removeDeviceEventData.data;
    //     queryClient.setQueryData(
    //       [ApiRoutes.UserHouse],
    //       (oldData: UserHouseResponse) => {
    //         const room = oldData.data.rooms.find((room) =>
    //           room.devices.some(
    //             (device) => device.device_id === removeDeviceData.deviceId,
    //           ),
    //         );
    //         return {
    //           ...oldData,
    //           data: {
    //             ...oldData.data,
    //             rooms: oldData.data.rooms.map((_room) =>
    //               _room.room_id === room?.room_id
    //                 ? {
    //                     ..._room,
    //                     devices: _room.devices.filter(
    //                       (_device) =>
    //                         _device.device_id !== removeDeviceData.deviceId,
    //                     ),
    //                   }
    //                 : _room,
    //             ),
    //           },
    //         } as UserHouseResponse;
    //       },
    //     );
    //     break;
    // }
  };

  useEffect(() => {
    let socket: WebSocket;

    if (controllerDeviceUrl && user?.id) {
      const webSocketUrl = `${controllerDeviceUrl?.replace("http", "ws")}ws/${
        user?.id
      }`;

      socket = new WebSocket(webSocketUrl);

      // Connection opened
      socket.onopen = () => {
        console.log("WebSocket connection opened");
        setSocket(socket);
        setIsConnected(true);
      };

      // Listen for messages
      socket.onmessage = (event) => {
        console.log("Socket event from server: ", event);
        const data: SocketEventData = JSON.parse(event.data);
        handleSocketEventData(data);
      };

      // Handle WebSocket errors
      socket.onerror = (error) => {
        console.log("WebSocket error: ", error);
        setIsConnected(false);
      };
    }

    // Close the WebSocket connection when the component unmounts
    return () => {
      console.log("Closing WebSocket connection");
      socket?.close();
      setIsConnected(false);
    };
  }, [controllerDeviceUrl, user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, notifications }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
