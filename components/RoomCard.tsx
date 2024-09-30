import useAuth from "@/hooks/useAuth";
import { useDeviceData, UserHouseResponse } from "@/hooks/useHouse";
import useSwitchDeviceMutation from "@/hooks/useSwitchDeviceMutation";
import { ApiRoutes, getTypedRoute, Routes } from "@/routes/routes";
import { ResponseStatusCodes, Room } from "@/utils/models";
import { Text } from "@rneui/themed";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { ToastAndroid, TouchableOpacity, View } from "react-native";
import Card from "./Card";
import Icon from "./Icon";

const RoomCard = ({ room }: { room: Room }) => {
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();
  const defaultDevice = useDeviceData(room.room_id, "default");
  const { mutate: switchDevice } = useSwitchDeviceMutation();

  const handleOnChange = (value: boolean) => {
    if (defaultDevice) {
      switchDevice(
        {
          houseId: room?.house_id,
          userId: userProfile?.id,
          userName: userProfile?.given_name,
          deviceId: defaultDevice.device_id,
          deviceName: defaultDevice.device_name,
          statusFrom: defaultDevice.status,
          statusTo: value,
        },
        {
          onSuccess: (res) => {
            if (res.status === "success") {
              queryClient.setQueryData(
                [ApiRoutes.UserHouse],
                (oldData: UserHouseResponse) => {
                  return {
                    ...oldData,
                    data: {
                      ...oldData.data,
                      rooms: oldData.data.rooms.map((r) =>
                        r.room_id === defaultDevice.room_id
                          ? {
                              ...r,
                              devices: r.devices.map((d) =>
                                d.device_id === defaultDevice.device_id
                                  ? { ...d, status: value }
                                  : d,
                              ),
                            }
                          : r,
                      ),
                    },
                  } as UserHouseResponse;
                },
              );
            } else if (
              res.status_code === ResponseStatusCodes.SWITCH_DEVICE_ERROR
            ) {
              ToastAndroid.show(
                "Switch Device Error: Try Restarting Controller Device.",
                ToastAndroid.LONG,
              );
              ToastAndroid.show(res.message, ToastAndroid.LONG);
            } else {
              ToastAndroid.show(res.message, ToastAndroid.LONG);
            }
          },
          onError: (res) => {
            ToastAndroid.show(res.message, ToastAndroid.LONG);
          },
        },
      );
    }
  };

  return (
    <TouchableOpacity
      onPress={() =>
        router.push(
          getTypedRoute(Routes.Room.replace("[roomId]", room.room_id)),
        )
      }
    >
      <Card
        item={room}
        value={defaultDevice?.status ?? false}
        onChange={defaultDevice ? handleOnChange : () => {}}
        render={(room) => (
          <View
            style={{
              paddingTop: 15,
              height: 150,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Icon name={room.room_name as string} />
            <Text>{room.room_name}</Text>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", gap: 6 }}>
                <Text>{room.devices.length}</Text>
                <Text style={{ color: "grey" }}>Devices</Text>
              </View>
              <View style={{ flexDirection: "row", gap: 6 }}>
                <Text>
                  {room.devices.filter((device) => device.status).length}
                </Text>
                <Text>ON</Text>
              </View>
            </View>
          </View>
        )}
      />
    </TouchableOpacity>
  );
};

export default RoomCard;
