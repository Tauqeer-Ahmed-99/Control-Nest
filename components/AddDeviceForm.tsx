import { useRoomsData } from "@/hooks/useHouse";
import { Button, Text, useTheme } from "@rneui/themed";
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import Select from "./Select";
import { HeaderPinConfig, Room } from "@/utils/models";
import InputField from "./InputField";
import useAvailableGPIOPins from "@/hooks/useAvailableGPIOPins";
import useAuth from "@/hooks/useAuth";
import useAddDeviceMutation from "@/hooks/useAddDeviceMutation";
import { useQueryClient } from "@tanstack/react-query";
import { ToastAndroid } from "react-native";
import { ApiRoutes } from "@/routes/routes";
import { useLocalSearchParams } from "expo-router";

// {
//   "houseId": "string",
//   "userId": "string",
//   "userName": "string",
//   "roomId": "string",
//   "pinNumber": 0,
//   "deviceName": "string"
// }

const AddDeviceForm = ({ closeForm }: { closeForm: () => void }) => {
  const {
    theme: {
      colors: { secondary },
    },
  } = useTheme();

  const { userProfile } = useAuth();
  const { roomId } = useLocalSearchParams();
  const rooms = useRoomsData();
  const room = useMemo(
    () => rooms?.find((room) => room.room_id === roomId),
    [roomId],
  );
  const [selectedRoom, setSelectedRoom] = useState<Room>(
    room ?? (rooms?.[0] as Room),
  );
  const [deviceName, setDeviceName] = useState("");
  const { data: availableGPIOPins } = useAvailableGPIOPins({
    userId: userProfile?.id as string,
  });

  const gpioPin = useMemo(
    () => availableGPIOPins?.data?.[0],
    [availableGPIOPins?.data.length],
  );

  const [selectedGPIOPin, setSelectedGPIOPin] =
    useState<HeaderPinConfig | null>(gpioPin ?? null);

  const { mutate: addDevice, isPending } = useAddDeviceMutation();

  const queryClient = useQueryClient();

  const handleSaveDevice = () => {
    addDevice(
      {
        houseId: selectedRoom?.house_id,
        userId: userProfile?.id,
        userName: userProfile?.given_name,
        roomId: selectedRoom?.room_id,
        pinNumber: selectedGPIOPin?.gpio_pin_number,
        deviceName,
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

  if (!rooms || !availableGPIOPins?.data) {
    return (
      <View>
        <Text style={{ textAlign: "center", fontSize: 18 }}>
          Something went wrong, please try again later.
        </Text>
      </View>
    );
  }

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
      {!roomId && (
        <Select
          label="Room"
          items={rooms}
          field="room_name"
          onValueChange={(newValue: Room) => setSelectedRoom(newValue)}
          selectedValue={selectedRoom}
        />
      )}
      <Select
        label="GPIO Pin"
        items={availableGPIOPins.data.sort(
          (a, b) => a.gpio_pin_number - b.gpio_pin_number,
        )}
        field="gpio_pin_number"
        onValueChange={(newValue: HeaderPinConfig) =>
          setSelectedGPIOPin(newValue)
        }
        selectedValue={selectedGPIOPin}
      />
      <InputField
        label="Device Name"
        placeholder="Enter device name"
        defaultValue=""
        onChangeText={(text) => setDeviceName(text)}
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
        <Button disabled={isPending} onPress={closeForm}>
          Cancel
        </Button>
        <Button loading={isPending} onPress={handleSaveDevice}>
          Save
        </Button>
      </View>
    </View>
  );
};

export default AddDeviceForm;
