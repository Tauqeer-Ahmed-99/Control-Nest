import React, { useState } from "react";
import AddButton from "@/components/AddButton";
import Card from "@/components/_Card";
import Container from "@/components/Container";
import Dialog from "@/components/Dialog";
import { Dialog as RNDialog, Text } from "@rneui/themed";
import { useRoomData } from "@/hooks/useHouse";
import useUpdateHeaderTitle from "@/hooks/useUpdateHeaderTitle";
import { router, useLocalSearchParams } from "expo-router";
import { FlatList, ToastAndroid } from "react-native";
import { Device } from "@/utils/models";
import useAddDeviceMutation from "@/hooks/useAddDeviceMutation";
import useAuth from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { ApiRoutes } from "@/routes/routes";
import { View } from "react-native";
import NoDataAvailable from "@/components/NoDataAvailable";

const Room = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const { userProfile } = useAuth();
  const { houseId, roomId } = useLocalSearchParams();
  const room = useRoomData(houseId as string, roomId as string);
  useUpdateHeaderTitle(room?.roomName ?? "My Room");
  const { mutate, isPending } = useAddDeviceMutation();
  const queryClient = useQueryClient();

  const onPressSettings = (item: unknown) => {
    setIsDialogVisible(true);
    setIsEditing(true);
    setSelectedDevice(item as Device);
  };

  const closeDialog = () => {
    setIsDialogVisible(false);
    setIsEditing(false);
    setSelectedDevice(null);
  };

  const addDevice = (data: { deviceName: string; pinNumber: number }) => {
    mutate(
      {
        houseId,
        userId: userProfile?.id,
        userName: `${userProfile?.given_name ?? ""} ${
          userProfile?.family_name ?? ""
        }`.trim(),
        roomId,
        deviceName: data.deviceName,
        pinNumber: data.pinNumber,
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
    closeDialog();
  };

  return (
    <>
      <Container>
        {room?.Devices && room.Devices.length > 0 ? (
          <FlatList
            data={room?.Devices}
            renderItem={({ item: device }) => (
              <Card
                key={device.deviceId}
                name="device"
                item={device}
                onPress={() =>
                  router.push(`${houseId}/${roomId}/${device.deviceId}`)
                }
                onPressSettings={onPressSettings}
                onPressDelete={() => {}}
              />
            )}
          />
        ) : (
          <NoDataAvailable
            title="You have not added any Device."
            description="Start adding device by tapping button below."
          />
        )}
      </Container>
      <AddButton iconName="device" onPress={() => setIsDialogVisible(true)} />
      <Dialog
        title={`${isEditing ? "Update" : "Add"} Device`}
        message={`${isEditing ? "Update" : "Enter"} device details.`}
        isDialogVisible={isDialogVisible}
        closeDialog={closeDialog}
        application="device"
        isEditing={isEditing}
        item={selectedDevice as Device}
        onSave={addDevice}
      />
      <RNDialog isVisible={isPending}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <RNDialog.Loading loadingProps={{ size: "large" }} />
          <Text style={{ fontSize: 18 }}>Addding new device..</Text>
        </View>
      </RNDialog>
    </>
  );
};

export default Room;
