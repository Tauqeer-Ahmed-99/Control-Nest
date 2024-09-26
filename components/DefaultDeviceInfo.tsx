import React from "react";
import Tile from "./Tile";
import { View } from "react-native";
import { Text, useTheme } from "@rneui/themed";
import { Device } from "@/utils/models";
import Switch from "./Switch";

const DefaultDeviceInfo = ({
  device,
  setDevice,
}: {
  device?: Device;
  setDevice: React.Dispatch<React.SetStateAction<Device | undefined>>;
}) => {
  const {
    theme: {
      colors: { primary },
    },
  } = useTheme();

  const handleOnChange = (value: boolean) => {
    setDevice((device) => ({
      ...(device as Device),
      is_default: value,
    }));
  };
  return (
    <Tile>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 16 }}>Default</Text>
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
          <Switch
            value={device?.is_default ?? false}
            onChange={handleOnChange}
          />
        </View>
      </View>
    </Tile>
  );
};

export default DefaultDeviceInfo;
