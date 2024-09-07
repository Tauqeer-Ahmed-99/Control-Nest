import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Switch, Text } from "@rneui/themed";
import { TouchableRipple } from "react-native-paper";
import { Device, House, Room } from "@/utils/models";

interface MyCardProps {
  name: "house" | "room" | "device";
  item: House | Room | Device;
  onPress?: () => void;
  onPressDelete?: () => void;
  onPressSwitch?: () => void;
  onPressSettings: (item: unknown) => void;
}

const Card = ({
  name,
  item,
  onPress,
  onPressSettings,
  onPressDelete,
  onPressSwitch,
}: MyCardProps) => {
  const [isSwitchOn, setIsSwitchOn] = useState(
    name === "device" ? (item as Device).status : false,
  );

  const onPressSwitchButton = (value: boolean) => {
    setIsSwitchOn(value);
    onPressSwitch?.();
  };

  const totalDevices = (item as House)?.Rooms?.map(
    ({ Devices }) => Devices.length,
  ).reduce((preVal, currVal) => preVal + currVal, 0);

  const getTitle = () => {
    switch (name) {
      case "house":
        return (item as House).houseName;
      case "room":
        return (item as Room).roomName;
      case "device":
        return (item as Device).deviceName;
      default:
        return "My Heading";
    }
  };

  return (
    <TouchableRipple borderless style={styles.card} onPress={onPress}>
      <>
        <View style={styles.container}>
          <Text style={styles.title}>{getTitle()}</Text>
          {name !== "device" && (
            <TouchableRipple
              borderless
              style={styles.settings}
              onPress={() => onPressSettings(item)}
            >
              <Feather name="settings" size={20} color="black" />
            </TouchableRipple>
          )}
        </View>
        <View style={styles.container}>
          <View>
            {name === "house" && (
              <>
                <Text>{`Rooms : ${(item as House).Rooms.length}`}</Text>
                <Text>{`Devices : ${totalDevices}`}</Text>
              </>
            )}
            {name === "room" && (
              <>
                <Text>{`Devices : ${(item as Room).Devices.length}`}</Text>
              </>
            )}
            {name === "device" && (
              <>
                <Text>{`Status : ${isSwitchOn ? "On" : "Off"}`}</Text>
              </>
            )}
          </View>
          {name === "device" && (
            <Switch
              value={isSwitchOn}
              onChange={(e) => onPressSwitchButton(e.nativeEvent.value)}
            />
          )}
        </View>
      </>
    </TouchableRipple>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: 12,
    paddingHorizontal: 16,
    paddingRight: 16,
    gap: 12,
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: 800 },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  settings: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  delete: {
    backgroundColor: "red",
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  switch: {
    backgroundColor: "transparent",
    height: undefined,
    width: 80,
    alignItems: "flex-end",
    borderRadius: undefined,
  },
});
