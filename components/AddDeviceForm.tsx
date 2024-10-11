import useAddDeviceMutation from "@/hooks/useAddDeviceMutation";
import useAvailableGPIOPins from "@/hooks/useAvailableGPIOPins";
import { useRoomsData } from "@/hooks/useHouse";
import { ApiRoutes } from "@/routes/routes";
import { HeaderPinConfig, Room } from "@/utils/models";
import { useUser } from "@clerk/clerk-expo";
import { Button, Text, useTheme } from "@rneui/themed";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { ToastAndroid, View } from "react-native";
import InputField from "./InputField";
import MessageContainer from "./MessageContainer";
import Select from "./Select";
import useUsername from "@/hooks/useUsername";

const AddDeviceForm = ({ closeForm }: { closeForm: () => void }) => {
  const {
    theme: {
      colors: { secondary },
    },
  } = useTheme();

  const { user } = useUser();
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
  const [deviceRating, setDeviceRating] = useState("");
  const { data: availableGPIOPins } = useAvailableGPIOPins({
    userId: user?.id as string,
  });
  const username = useUsername();

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
        userId: user?.id,
        userName: username,
        roomId: selectedRoom?.room_id,
        pinNumber: selectedGPIOPin?.gpio_pin_number,
        deviceName,
        wattage: isNaN(Number(deviceRating)) ? 0.0 : Number(deviceRating),
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
        <MessageContainer message="Something went wrong, please try again later." />
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
      <InputField
        label="Pwer Consumption Rating"
        placeholder="Enter in watt"
        defaultValue=""
        onChangeText={(text) => setDeviceRating(text)}
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
