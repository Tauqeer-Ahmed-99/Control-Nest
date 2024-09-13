import React, { useState } from "react";
import { ToastAndroid, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Grid from "@/components/Grid";
import { useRoomData } from "@/hooks/useHouse";
import { BottomSheet, Button, Text, useTheme } from "@rneui/themed";
import DeviceCard from "@/components/DeviceCard";
import { ScrollView } from "react-native-virtualized-view";
import useUpdateHeaderTitle from "@/hooks/useUpdateHeaderTitle";
import AvailableRooms from "@/components/AvailableRooms";
import BottomNavigation from "@/components/BottomNavigation";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import useRemoveRoomMutation from "@/hooks/useRemoveRoomMutation";
import { useQueryClient } from "@tanstack/react-query";
import { ApiRoutes } from "@/routes/routes";
import useAuth from "@/hooks/useAuth";

// {
//   "userId": "string",
//   "userName": "string",
//   "houseId": "string",
//   "roomId": "string"
// }

const Room = () => {
  const {
    theme: {
      colors: { primary, secondary },
    },
  } = useTheme();
  const { roomId } = useLocalSearchParams();
  const { userProfile } = useAuth();
  const room = useRoomData(roomId as string);
  const [isDeleteRoomConfirmationOpen, setIsDeleteRoomConfirmationOpen] =
    useState(false);
  const { mutate: removeRoom, isPending: isDeletingRoom } =
    useRemoveRoomMutation();

  const queryClient = useQueryClient();

  const deleteRoom = () => {
    removeRoom(
      {
        userId: userProfile?.id,
        userName: userProfile?.given_name,
        houseId: room?.house_id,
        roomId: roomId,
      },
      {
        onSuccess: (res) => {
          if (res.status === "success") {
            router.back();
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
  };

  const DeleteRoomButton = (
    <TouchableOpacity onPress={() => setIsDeleteRoomConfirmationOpen(true)}>
      <MaterialIcons name="delete-outline" size={24} color="white" />
    </TouchableOpacity>
  );

  useUpdateHeaderTitle(room?.room_name ?? "Room", DeleteRoomButton);

  if (!room) {
    return (
      <View>
        <Text>Room with id '{roomId}' not found.</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: primary,
        paddingHorizontal: 18,
        paddingBottom: 90,
      }}
    >
      <AvailableRooms />
      <ScrollView>
        {room.devices.length > 0 ? (
          <Grid
            items={room.devices}
            renderItem={(device) => (
              <DeviceCard key={device.device_id} device={device} />
            )}
            rowGap={30}
          />
        ) : (
          <Text style={{ textAlign: "center", color: "grey" }}>
            No device added to this room.
          </Text>
        )}
      </ScrollView>
      <BottomNavigation />
      <BottomSheet
        isVisible={isDeleteRoomConfirmationOpen}
        onBackdropPress={
          isDeletingRoom
            ? undefined
            : () => setIsDeleteRoomConfirmationOpen(false)
        }
      >
        <View
          style={{
            padding: 16,
            borderTopRightRadius: 12,
            borderTopLeftRadius: 12,
            backgroundColor: secondary,
            gap: 16,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 18 }}>
            Delete {room.room_name}
          </Text>
          <Text>Are you sure you want to delete {room.room_name}?</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 16,
            }}
          >
            <Button
              disabled={isDeletingRoom}
              onPress={() => setIsDeleteRoomConfirmationOpen(false)}
            >
              Cancel
            </Button>
            <Button loading={isDeletingRoom} onPress={deleteRoom}>
              Yes
            </Button>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

export default Room;
