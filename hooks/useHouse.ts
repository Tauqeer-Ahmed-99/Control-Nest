import { ApiRoutes } from "@/routes/routes";
import { useUser } from "@clerk/clerk-expo";
import { ApiResponse, House } from "../utils/models";
import useApiQuery from "./useApiQuery";

export interface UserHouseSearchParams {
  userId: string;
}

export type UserHouseResponse = ApiResponse<House>;

const useHouse = (searchParams: UserHouseSearchParams) => {
  return useApiQuery<UserHouseResponse>(ApiRoutes.UserHouse, {
    searchParams,
  });
};

export const useHouseData = () => {
  const { user } = useUser();
  const { data } = useHouse({ userId: user?.id as string });

  return data?.data;
};

export const useRoomData = (roomId: string) => {
  const { user } = useUser();
  const { data } = useHouse({ userId: user?.id as string });

  return data?.data?.rooms.find((room) => room.room_id === roomId);
};

export const useRoomsData = () => {
  const { user } = useUser();
  const { data } = useHouse({ userId: user?.id as string });

  return data?.data?.rooms;
};

export const useDeviceData = (roomId: string, deviceId: string | "default") => {
  const { user } = useUser();
  const { data } = useHouse({ userId: user?.id as string });

  const devices = data?.data?.rooms?.find(
    (room) => room.room_id === roomId,
  )?.devices;

  if (deviceId === "default") {
    return devices?.find((device) => device.is_default) ?? devices?.[0];
  }

  return devices?.find((device) => device.device_id === deviceId);
};

export const useDevicesData = () => {
  const { user } = useUser();
  const { data } = useHouse({ userId: user?.id as string });

  return data?.data?.rooms.flatMap((room) => room.devices);
};

export default useHouse;
