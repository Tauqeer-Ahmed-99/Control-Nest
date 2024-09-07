import React from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Grid from "@/components/Grid";
import { useRoomData } from "@/hooks/useHouse";
import { Text, useTheme } from "@rneui/themed";
import DeviceCard from "@/components/DeviceCard";
import { ScrollView } from "react-native-virtualized-view";
import useUpdateHeaderTitle from "@/hooks/useUpdateHeaderTitle";
import AvailableRooms from "@/components/AvailableRooms";
import BottomNavigation from "@/components/BottomNavigation";

const Room = () => {
  const {
    theme: {
      colors: { primary },
    },
  } = useTheme();
  const { roomId } = useLocalSearchParams();
  const room = useRoomData(roomId as string);
  useUpdateHeaderTitle(room?.room_name ?? "Room");

  if (!room) {
    return (
      <View>
        <Text>Room with id '{roomId}' not found.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: primary, paddingHorizontal: 18 }}>
      <AvailableRooms />
      <ScrollView>
        <Grid
          items={room.devices}
          renderItem={(device) => (
            <DeviceCard key={device.device_id} device={device} />
          )}
          rowGap={30}
        />
      </ScrollView>
      <BottomNavigation />
    </View>
  );
};

export default Room;
