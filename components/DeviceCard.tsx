import { getTypedRoute, Routes } from "@/routes/routes";
import { Device } from "@/utils/models";
import { Text } from "@rneui/themed";
import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import Card from "./Card";
import Icon from "./Icon";
import { useState } from "react";

const DeviceCard = ({ device }: { device: Device }) => {
  const [status, setStatus] = useState(false);

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
        value={status}
        onChange={(value) => setStatus(value)}
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
