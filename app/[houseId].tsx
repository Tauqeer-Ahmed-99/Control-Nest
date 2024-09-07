import AddButton from "@/components/AddButton";
import Card from "@/components/_Card";
import Container from "@/components/Container";
import Dialog from "@/components/Dialog";
import NoDataAvailable from "@/components/NoDataAvailable";
import useAddRoomMutation from "@/hooks/useAddRoomMutation";
import useAuth from "@/hooks/useAuth";
import useHouse from "@/hooks/useHouse";
import useRemoveRoomMutation from "@/hooks/useRemoveRoomMutation";
import useRoomDetailsMutation from "@/hooks/useRoomDetailsMutation";
import useUpdateHeaderTitle from "@/hooks/useUpdateHeaderTitle";
import { ApiRoutes } from "@/routes/routes";
import { Room } from "@/utils/models";
import { Button, Text } from "@rneui/themed";
import { Dialog as RNDialog } from "@rneui/themed";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { FlatList, ToastAndroid, View } from "react-native";

const House = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const { houseId } = useLocalSearchParams();
  const house = useHouse();
  useUpdateHeaderTitle(house?.houseName ?? "My House");
  const { mutate: addRoom, isPending: isAddingRoom } = useAddRoomMutation();
  const { mutate: removeRoom, isPending: isRemovingRoom } =
    useRemoveRoomMutation();
  const { mutate, isPending } = useRoomDetailsMutation();
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();

  const onPressSettings = (item: unknown) => {
    setIsDialogVisible(true);
    setIsEditing(true);
    setSelectedRoom(item as Room);
  };

  const closeDialog = () => {
    setIsDialogVisible(false);
    setIsEditing(false);
    setSelectedRoom(null);
  };

  const saveRoom = (data: { roomName: string }) => {
    if (isEditing) {
      mutate(
        {
          userId: userProfile?.id,
          roomId: selectedRoom?.roomId,
          roomName: data.roomName,
        },
        {
          onSuccess: (res) => {
            if (res.status === "success") {
              queryClient.invalidateQueries({
                queryKey: [ApiRoutes.UserHouses],
              });
            }
            ToastAndroid.show(res.message, ToastAndroid.LONG);
          },
          onError: (res) => {
            ToastAndroid.show(res.message, ToastAndroid.LONG);
          },
        },
      );
    } else {
      addRoom(
        {
          userId: userProfile?.id,
          userName: `${userProfile?.given_name ?? ""} ${
            userProfile?.family_name ?? ""
          }`.trim(),
          houseId,
          roomName: data.roomName,
        },
        {
          onSuccess: (res) => {
            if (res.status === "success") {
              queryClient.invalidateQueries({
                queryKey: [ApiRoutes.UserHouses],
              });
            }
            ToastAndroid.show(res.message, ToastAndroid.LONG);
          },
          onError: (res) => {
            ToastAndroid.show(res.message, ToastAndroid.LONG);
          },
        },
      );
    }

    closeDialog();
  };

  const removeConfirmation = (item: Room) => {
    closeDialog();
    setIsConfirmationOpen(true);
    setSelectedRoom(item);
  };

  const removeRoomConfirm = () => {
    setIsConfirmationOpen(false);
    removeRoom(
      {
        userId: userProfile?.id,
        userName: `${userProfile?.given_name ?? ""} ${
          userProfile?.family_name ?? ""
        }`.trim(),
        houseId,
        roomId: selectedRoom?.roomId,
      },
      {
        onSuccess: (res) => {
          if (res.status === "success") {
            queryClient.invalidateQueries({
              queryKey: [ApiRoutes.UserHouses],
            });
          }
          ToastAndroid.show(res.message, ToastAndroid.LONG);
          setSelectedRoom(null);
        },
        onError: (res) => {
          ToastAndroid.show(res.message, ToastAndroid.LONG);
          setSelectedRoom(null);
        },
      },
    );
  };

  return (
    <>
      <Container>
        {house?.Rooms && house.Rooms.length > 0 ? (
          <FlatList
            data={house?.Rooms}
            renderItem={({ item: room }) => (
              <Card
                key={room.roomId}
                name="room"
                item={room}
                onPress={() => router.push(`${houseId}/${room.roomId}`)}
                onPressSettings={onPressSettings}
                onPressDelete={() => {}}
              />
            )}
          />
        ) : (
          <NoDataAvailable
            title="You have not added any Room."
            description="Start adding room by tapping button below."
          />
        )}
      </Container>
      <AddButton iconName="room" onPress={() => setIsDialogVisible(true)} />
      <Dialog
        title={`${isEditing ? "Update" : "Add"} Room`}
        message={`${isEditing ? "Update" : "Enter"} room name.`}
        isDialogVisible={isDialogVisible}
        closeDialog={closeDialog}
        application="room"
        isEditing={isEditing}
        item={selectedRoom as Room}
        onSave={saveRoom}
        onDelete={removeConfirmation}
      />
      <RNDialog isVisible={isPending || isAddingRoom || isRemovingRoom}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <RNDialog.Loading loadingProps={{ size: "large" }} />
          <Text style={{ fontSize: 18 }}>
            {isAddingRoom
              ? "Creating new room..."
              : isRemovingRoom
              ? `Removing room '${selectedRoom?.roomName}...'`
              : "Saving room name..."}
          </Text>
        </View>
      </RNDialog>
      <RNDialog isVisible={isConfirmationOpen}>
        <View style={{ gap: 16 }}>
          <Text style={{ fontWeight: 900 }}>Remove Room</Text>
          <Text>
            {`Are you sure, you want to remove '${selectedRoom?.roomName}' ?`}
          </Text>
        </View>
        <RNDialog.Actions>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Button
              type="outline"
              onPress={() => {
                setIsConfirmationOpen(false);
                setSelectedRoom(null);
              }}
            >
              Cancel
            </Button>
            <Button
              buttonStyle={{ backgroundColor: "rgba(214, 61, 57, 1)" }}
              onPress={removeRoomConfirm}
            >
              Remove
            </Button>
          </View>
        </RNDialog.Actions>
      </RNDialog>
    </>
  );
};

export default House;
