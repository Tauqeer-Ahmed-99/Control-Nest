import Tile from "@/components/Tile";
import useDeviceMutation from "@/hooks/useDeviceMutation";
import { useRoomData } from "@/hooks/useHouse";
import useUsername from "@/hooks/useUsername";
import { ApiRoutes } from "@/routes/routes";
import { Device as DeviceType } from "@/utils/models";
import { useUser } from "@clerk/clerk-expo";
import { BottomSheet, Button, Text, useTheme } from "@rneui/themed";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback } from "react";
import { ActivityIndicator, ToastAndroid, View } from "react-native";

const SaveDevice = ({
  device,
  deviceNameRef,
  deviceWattageRef,
  setIsError,
}: {
  device?: DeviceType;
  deviceNameRef: React.MutableRefObject<string>;
  deviceWattageRef: React.MutableRefObject<string>;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    theme: {
      colors: { primary, success },
    },
  } = useTheme();
  const { roomId } = useLocalSearchParams();
  const room = useRoomData(roomId as string);
  const queryClient = useQueryClient();
  const { mutate: mutateDevice, isPending: isConfigureDeviceLoading } =
    useDeviceMutation();
  const { user } = useUser();
  const username = useUsername();

  const saveDeviceConfig = useCallback(async () => {
    if (device?.is_scheduled) {
      const isSomeDaysSelected = Boolean(device.days_scheduled.trim());
      if (!isSomeDaysSelected || !device.start_time || !device.off_time) {
        setIsError(true);
        ToastAndroid.show(
          "Atlease one day must be selected and Start, Off time is required to schedule a device.",
          ToastAndroid.LONG,
        );
        return;
      }
    }

    mutateDevice(
      {
        houseId: room?.house_id,
        userId: user?.id,
        userName: username,
        deviceId: device?.device_id,
        deviceName: deviceNameRef.current,
        pinNumber: device?.pin_number,
        status: device?.status,
        isDefault: device?.is_default,
        isScheduled: device?.is_scheduled,
        daysScheduled: device?.days_scheduled ?? "",
        startTime: device?.start_time ?? "",
        offTime: device?.off_time ?? "",
        wattage: isNaN(Number(deviceWattageRef.current))
          ? 0.0
          : Number(deviceWattageRef.current),
      },
      {
        onSuccess: (res) => {
          if (res.status === "success") {
            queryClient.invalidateQueries({ queryKey: [ApiRoutes.UserHouse] });
          } else {
            ToastAndroid.show(res.message, ToastAndroid.LONG);
          }
        },
        onError: (res) => {
          ToastAndroid.show(res.message, ToastAndroid.LONG);
        },
      },
    );
  }, [device]);

  return (
    <>
      <Tile>
        <Button disabled={isConfigureDeviceLoading} onPress={saveDeviceConfig}>
          Save
        </Button>
      </Tile>
      <BottomSheet isVisible={isConfigureDeviceLoading}>
        <View
          style={{
            height: 100,
            padding: 20,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            backgroundColor: primary,
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
          }}
        >
          <ActivityIndicator size="large" color={success} />
          <Text>Loading, please wait...</Text>
        </View>
      </BottomSheet>
    </>
  );
};

export default SaveDevice;
