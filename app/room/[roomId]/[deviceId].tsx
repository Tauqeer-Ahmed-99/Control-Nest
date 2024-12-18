import BottomNavigation from "@/components/BottomNavigation";
import DefaultDeviceInfo from "@/components/DefaultDeviceInfo";
import DeviceInputFieldsInfo from "@/components/DeviceInputFieldInfo";
import DeviceScheduleInfo from "@/components/DeviceScheduleInfo";
import DeviceStatusInfo from "@/components/DeviceStatusInfo";
import DeviceUpdateHistory from "@/components/DeviceUpdateHistory";
import RemoveDevice from "@/components/RemoveDevice";
import SaveDevice from "@/components/SaveDevice";
import { useDeviceData } from "@/hooks/useHouse";
import { useTheme } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-virtualized-view";

const Device = () => {
  const {
    theme: {
      colors: { primary },
    },
  } = useTheme();
  const { roomId, deviceId } = useLocalSearchParams();
  const deviceData = useDeviceData(roomId as string, deviceId as string);
  const [device, setDevice] = useState(deviceData);
  const deviceNameRef = useRef(device?.device_name ?? "");
  const deviceWattageRef = useRef(device?.wattage?.toString() ?? "");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (deviceData) {
      setDevice(deviceData);
    }
  }, [JSON.stringify(deviceData)]);

  useEffect(() => {
    deviceNameRef.current = deviceData?.device_name ?? deviceNameRef.current;
    deviceWattageRef.current =
      deviceData?.wattage?.toString() ?? deviceWattageRef.current;
  }, [deviceData?.device_name, deviceData?.wattage]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: primary,
        padding: 16,
        paddingBottom: 90,
      }}
    >
      <ScrollView>
        <View style={{ gap: 16 }}>
          <DeviceInputFieldsInfo
            device={device}
            setDevice={setDevice}
            deviceNameRef={deviceNameRef}
            deviceWattageRef={deviceWattageRef}
          />
          <DeviceStatusInfo device={device} setDevice={setDevice} />
          <DefaultDeviceInfo device={device} setDevice={setDevice} />
          <DeviceScheduleInfo
            device={device}
            setDevice={setDevice}
            isError={isError}
          />
          <SaveDevice
            device={device}
            deviceNameRef={deviceNameRef}
            deviceWattageRef={deviceWattageRef}
            setIsError={setIsError}
          />
          <DeviceUpdateHistory device={device} />
          <RemoveDevice />
        </View>
      </ScrollView>
      <BottomNavigation />
    </View>
  );
};

export default Device;
