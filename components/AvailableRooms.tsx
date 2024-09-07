import { useRoomsData } from "@/hooks/useHouse";
import { getTypedRoute, Routes } from "@/routes/routes";
import { Room } from "@/utils/models";
import { Text, useTheme } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-virtualized-view";

const ActiveTile = ({
  isActive,
  children,
}: {
  isActive: boolean;
  children: React.ReactNode;
}) => {
  const {
    theme: {
      colors: { secondary, success, warning, error },
    },
  } = useTheme();

  const style: StyleProp<ViewStyle> = {
    borderRadius: 999,
    backgroundColor: secondary,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  };

  if (isActive) {
    return (
      <LinearGradient
        dither
        colors={[warning, success, error]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={style}
      >
        {children}
      </LinearGradient>
    );
  }

  return <View style={style}>{children}</View>;
};

const RoomTile = ({ room, isActive }: { room: Room; isActive: boolean }) => {
  return (
    <TouchableOpacity
      onPress={() =>
        router.replace(
          getTypedRoute(Routes.Room.replace("[roomId]", room.room_id)),
        )
      }
    >
      <ActiveTile isActive={isActive}>
        <Text
          style={{
            fontFamily: "Lexend_600SemiBold",
            fontSize: 16,
            color: isActive ? "#000000" : "#ffffff",
          }}
        >
          {room.room_name}
        </Text>
      </ActiveTile>
    </TouchableOpacity>
  );
};

const AvailableRooms = () => {
  const rooms = useRoomsData();
  const { roomId } = useLocalSearchParams();

  if (!rooms) {
    return null;
  }

  return (
    <View>
      <ScrollView horizontal>
        <View
          style={{
            marginVertical: 18,
            flexDirection: "row",
            gap: 12,
          }}
        >
          {rooms.map((room) => (
            <RoomTile
              key={room.room_id}
              room={room}
              isActive={room.room_id === roomId}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default AvailableRooms;
