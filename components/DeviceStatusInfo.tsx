import Switch from "@/components/Switch";
import Tile from "@/components/Tile";
import { UserHouseResponse, useRoomData } from "@/hooks/useHouse";
import useSwitchDeviceMutation from "@/hooks/useSwitchDeviceMutation";
import { ApiRoutes } from "@/routes/routes";
import { Device as DeviceType, ResponseStatusCodes } from "@/utils/models";
import { useUser } from "@clerk/clerk-expo";
import { Text, useTheme } from "@rneui/themed";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback } from "react";
import { ToastAndroid, View } from "react-native";

const DeviceStatusInfo = ({
  device,
  setDevice,
}: {
  device?: DeviceType;
  setDevice: React.Dispatch<React.SetStateAction<DeviceType | undefined>>;
}) => {
  const {
    theme: {
      colors: { primary },
    },
  } = useTheme();
  const { roomId } = useLocalSearchParams();
  const { user } = useUser();
  const room = useRoomData(roomId as string);
  const { mutate: switchDevice } = useSwitchDeviceMutation();

  const queryClient = useQueryClient();

  const handleOnChange = useCallback(
    (value: boolean) => {
      setDevice((device) => ({
        ...(device as DeviceType),
        status: value,
      }));
      switchDevice(
        {
          houseId: room?.house_id,
          userId: user?.id,
          userName: user?.fullName,
          deviceId: device?.device_id,
          deviceName: device?.device_name,
          statusFrom: device?.status,
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
                        r.room_id === device?.room_id
                          ? {
                              ...r,
                              devices: r.devices.map((d) =>
                                d.device_id === device?.device_id
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
    },
    [room?.house_id, user?.id, user?.fullName, device?.status],
  );

  return (
    <Tile>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 16 }}>Status</Text>
        <View
          style={{
            height: 45,
            width: 80,
            backgroundColor: primary,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
          }}
        >
          <Switch value={device?.status ?? false} onChange={handleOnChange} />
        </View>
      </View>
    </Tile>
  );
};

export default DeviceStatusInfo;
