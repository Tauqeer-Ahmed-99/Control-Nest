import { UserHouseResponse, useRoomData } from "@/hooks/useHouse";
import useSwitchDeviceMutation from "@/hooks/useSwitchDeviceMutation";
import { ApiRoutes, getTypedRoute, Routes } from "@/routes/routes";
import { Device, ResponseStatusCodes } from "@/utils/models";
import { useUser } from "@clerk/clerk-expo";
import { Text } from "@rneui/themed";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { ToastAndroid, TouchableOpacity, View } from "react-native";
import Card from "./Card";
import Icon from "./Icon";
import useUsername from "@/hooks/useUsername";

const DeviceCard = ({ device }: { device: Device }) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const room = useRoomData(device.room_id);
  const { mutate: switchDevice } = useSwitchDeviceMutation();
  const username = useUsername();

  const handleOnChange = (value: boolean) => {
    switchDevice(
      {
        houseId: room?.house_id,
        userId: user?.id,
        userName: username,
        deviceId: device.device_id,
        deviceName: device.device_name,
        statusFrom: device.status,
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
                      r.room_id === device.room_id
                        ? {
                            ...r,
                            devices: r.devices.map((d) =>
                              d.device_id === device.device_id
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
  };

  return (
    <TouchableOpacity
      onPress={() =>
        router.push(
          getTypedRoute(
            Routes.Device.replace("[roomId]", device.room_id).replace(
              "[deviceId]",
              device.device_id,
            ),
          ),
        )
      }
    >
      <Card
        item={device}
        value={device.status}
        onChange={(value) => handleOnChange(value)}
        render={(device) => (
          <View
            style={{
              paddingTop: 15,
              height: 150,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Icon name={device.device_name as string} />
            <Text>{device.device_name}</Text>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", gap: 6 }}>
                <Text style={{ color: "grey" }}>Status</Text>
              </View>
              <View style={{ flexDirection: "row", gap: 6 }}>
                <Text>{device.status ? "ON" : "OFF"}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </TouchableOpacity>
  );
};

export default DeviceCard;
