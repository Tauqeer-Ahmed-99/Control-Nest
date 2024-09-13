import { Button, Text, useTheme } from "@rneui/themed";
import React, { useState } from "react";
import { ToastAndroid, View } from "react-native";
import InputField from "./InputField";
import useAddRoomMutation from "@/hooks/useAddRoomMutation";
import useAuth from "@/hooks/useAuth";
import { useHouseData, useRoomsData } from "@/hooks/useHouse";
import { useQueryClient } from "@tanstack/react-query";
import { ApiRoutes } from "@/routes/routes";

const AddRoomForm = ({ closeForm }: { closeForm: () => void }) => {
  const {
    theme: {
      colors: { secondary },
    },
  } = useTheme();
  const { userProfile } = useAuth();
  const house = useHouseData();
  const [roomName, setRoomName] = useState("");
  const { mutate: addRoom, isPending } = useAddRoomMutation();

  const queryClient = useQueryClient();

  const handleSaveRoom = () => {
    addRoom(
      {
        userId: userProfile?.id,
        userName: userProfile?.given_name,
        houseId: house?.house_id,
        roomName,
      },
      {
        onSuccess: (res) => {
          if (res.status === "success") {
            queryClient.invalidateQueries({ queryKey: [ApiRoutes.UserHouse] });
          } else {
            ToastAndroid.show(res.message, ToastAndroid.LONG);
          }
          closeForm();
        },
        onError: (res) => {
          ToastAndroid.show(res.message, ToastAndroid.LONG);
        },
      },
    );
  };

  return (
    <View
      style={{
        padding: 16,
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
        backgroundColor: secondary,
        gap: 16,
      }}
    >
      <Text style={{ textAlign: "center", fontSize: 18 }}>Add New Room</Text>
      <InputField
        label="Room Name"
        placeholder="Enter room name"
        defaultValue=""
        onChangeText={(text) => setRoomName(text)}
        disabled={isPending}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: 16,
          paddingHorizontal: 16,
        }}
      >
        <Button onPress={closeForm} disabled={isPending}>
          Cancel
        </Button>
        <Button onPress={handleSaveRoom} loading={isPending}>
          Save
        </Button>
      </View>
    </View>
  );
};

export default AddRoomForm;
