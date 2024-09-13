import { useRoomsData } from "@/hooks/useHouse";
import { Text, useTheme } from "@rneui/themed";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import { getTypedRoute, Routes } from "@/routes/routes";

const Rooms = () => {
  const { theme } = useTheme();
  const rooms = useRoomsData();

  if (!rooms) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
        <Text style={{ textAlign: "center", color: "grey" }}>
          Unable to load rooms.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{ flex: 1, padding: 16, backgroundColor: theme.colors.primary }}
    >
      <ScrollView>
        <View style={{ gap: 16 }}>
          {rooms.map((room) => (
            <TouchableOpacity
              key={room.room_id}
              onPress={() =>
                router.push(
                  getTypedRoute(Routes.Room.replace("[roomId]", room.room_id)),
                )
              }
            >
              <View
                style={{
                  padding: 16,
                  borderRadius: 12,
                  backgroundColor: theme.colors.secondary,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text>{room.room_name}</Text>
                <AntDesign name="right" size={24} color="grey" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Rooms;
