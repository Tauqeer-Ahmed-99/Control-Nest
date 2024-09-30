import BottomNavigation from "@/components/BottomNavigation";
import DeviceCard from "@/components/DeviceCard";
import Header from "@/components/Header";
import MessageContainer from "@/components/MessageContainer";
import { useRoomsData } from "@/hooks/useHouse";
import { getTypedRoute, Routes } from "@/routes/routes";
import { Text, useTheme } from "@rneui/themed";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-virtualized-view";

const Devices = () => {
  const { theme } = useTheme();
  const rooms = useRoomsData();
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 16,
        paddingBottom: 90,
        backgroundColor: theme.colors.primary,
      }}
    >
      <ScrollView>
        {rooms ? (
          rooms.map((room) => (
            <View key={room.room_id}>
              <Header
                heading={room.room_name ?? "Room"}
                onDetails={() =>
                  router.push(
                    getTypedRoute(
                      Routes.Room.replace("[roomId]", room.room_id),
                    ),
                  )
                }
              />
              <View style={{ width: "100%" }}>
                {room.devices.length > 0 ? (
                  <ScrollView horizontal>
                    <View
                      style={{ height: 220, flexDirection: "row", gap: 20 }}
                    >
                      {room.devices.map((device) => (
                        <DeviceCard key={device.device_id} device={device} />
                      ))}
                    </View>
                  </ScrollView>
                ) : (
                  <MessageContainer message="No device added to this room." />
                )}
              </View>
            </View>
          ))
        ) : (
          <View>
            <MessageContainer message="No rooms available." />
          </View>
        )}
      </ScrollView>
      <BottomNavigation />
    </View>
  );
};

export default Devices;
