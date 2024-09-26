import Tile from "@/components/Tile";
import { Device as DeviceType } from "@/utils/models";
import { Text } from "@rneui/themed";
import React from "react";
import { View } from "react-native";

const DeviceUpdateHistory = ({ device }: { device?: DeviceType }) => {
  return (
    <Tile>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16 }}>Last Updated</Text>
        <Text>
          {new Date(device!.updated_at).toLocaleDateString()} @{" "}
          {new Date(device!.updated_at).toLocaleTimeString()}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16 }}>Device Created</Text>
        <Text>
          {new Date(device!.created_at).toLocaleDateString()} @{" "}
          {new Date(device!.created_at).toLocaleTimeString()}
        </Text>
      </View>
    </Tile>
  );
};

export default DeviceUpdateHistory;
