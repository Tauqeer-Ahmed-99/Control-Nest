import { getTypedRoute, Routes } from "@/routes/routes";
import { Room } from "@/utils/models";
import { Text } from "@rneui/themed";
import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import Card from "./Card";
import Icon from "./Icon";
import { useState } from "react";

const RoomCard = ({ room }: { room: Room }) => {
  const [status, setStatus] = useState(false);
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
        value={status}
        onChange={(value) => setStatus(value)}
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
