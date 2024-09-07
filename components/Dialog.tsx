import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { TextInput, TouchableRipple } from "react-native-paper";
import { Button, Dialog as RNPDialog, Text } from "@rneui/themed";
import { Device, House, Room } from "@/utils/models";

interface DialogProps {
  title: string;
  message: string;
  isDialogVisible: boolean;
  isEditing: boolean;
  onSave?: (data: any) => void;
  onDelete?: (item: any) => void;
  closeDialog: () => void;
  application: "home" | "room" | "device";
  item?: House | Room | Device;
}

const Dialog = ({
  title,
  message,
  isDialogVisible,
  isEditing,
  application,
  item,
  onSave,
  onDelete,
  closeDialog,
}: DialogProps) => {
  const [deviceID, setDeviceID] = useState(
    isEditing
      ? (item as House)?.ControllerDevice?.controllerDeviceId
        ? `NMTHAS-${(item as House)?.ControllerDevice?.controllerDeviceId}`
        : ""
      : "",
  );
  const [houseName, setHouseName] = useState(
    isEditing ? (item as House)?.houseName : "",
  );
  const [password, setPassword] = useState("");
  const [roomName, setRoomName] = useState(
    isEditing ? (item as Room)?.roomName ?? "" : "",
  );
  const [deviceName, setDeviceName] = useState(
    isEditing ? (item as Device)?.deviceName : "",
  );
  const [pinNumber, setPinNumber] = useState(
    isEditing ? (item as Device)?.pinNumber : Number(),
  );

  useEffect(() => {
    setDeviceID(
      (item as House)?.ControllerDevice?.controllerDeviceId
        ? `NMTHAS-${(item as House)?.ControllerDevice?.controllerDeviceId}`
        : "",
    );
    setHouseName((item as House)?.houseName);
    setRoomName((item as Room)?.roomName ?? "");
    setDeviceName((item as Device)?.deviceName);
  }, [isEditing, item]);

  return (
    <RNPDialog
      isVisible={isDialogVisible}
      onBackdropPress={() => closeDialog()}
      style={{ backgroundColor: "#fff", padding: 16, gap: 16 }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: 900 }}>{title}</Text>
        <TouchableRipple
          borderless
          style={{
            height: 40,
            width: 40,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => closeDialog()}
        >
          <AntDesign name="close" size={24} color="grey" />
        </TouchableRipple>
      </View>
      <Text>{message}</Text>
      <View style={{ marginVertical: 12, gap: 12 }}>
        {application === "home" && (
          <>
            <TextInput
              label="Device ID"
              style={{ backgroundColor: "#fff" }}
              value={deviceID}
              mode="outlined"
              onChangeText={(text) => setDeviceID(text)}
              disabled={isEditing}
            />
            {isEditing && (
              <TextInput
                label="House Name"
                style={{ backgroundColor: "#fff" }}
                value={houseName}
                mode="outlined"
                onChangeText={(text) => setHouseName(text)}
              />
            )}
            {!isEditing && (
              <TextInput
                label="Password"
                style={{ backgroundColor: "#fff" }}
                value={password}
                mode="outlined"
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
              />
            )}
          </>
        )}
        {application === "room" && (
          <TextInput
            label="Room Name"
            style={{ backgroundColor: "#fff" }}
            value={roomName}
            mode="outlined"
            onChangeText={(text) => setRoomName(text)}
          />
        )}
        {application === "device" && (
          <>
            <TextInput
              label="Device Name"
              style={{ backgroundColor: "#fff" }}
              value={deviceName}
              mode="outlined"
              onChangeText={(text) => setDeviceName(text)}
            />
            <TextInput
              label="GPIO Pin"
              style={{ backgroundColor: "#fff" }}
              value={pinNumber.toString()}
              mode="outlined"
              onChangeText={(text) =>
                setPinNumber(isNaN(Number(text)) ? pinNumber : Number(text))
              }
            />
          </>
        )}
      </View>
      {isEditing && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>{`Remove ${application === "home" ? "House" : "Room"}`}</Text>
          <TouchableRipple
            borderless
            style={{
              height: 40,
              width: 40,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
            rippleColor="#ffe1e1"
            onPress={() => onDelete?.(item)}
          >
            <MaterialIcons name="delete-outline" size={24} color="#dc1212" />
          </TouchableRipple>
        </View>
      )}
      <RNPDialog.Actions>
        <Button
          style={{ width: 80, backgroundColor: "#3e31ab" }}
          onPress={() =>
            onSave?.({
              deviceID,
              password,
              houseName,
              roomName,
              deviceName,
              pinNumber,
            })
          }
        >
          Save
        </Button>
      </RNPDialog.Actions>
    </RNPDialog>
  );
};

export default Dialog;
