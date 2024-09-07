import {
  FontAwesome6,
  Fontisto,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { FAB } from "@rneui/themed";

interface AddButtonProps {
  iconName: "home" | "room" | "device";
  visible?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

const AddButton = ({
  iconName,
  disabled,
  visible,
  onPress,
}: AddButtonProps) => {
  return (
    <FAB
      icon={
        <>
          {iconName === "home" && (
            <Fontisto name="home" size={24} color="white" />
          )}
          {iconName === "room" && (
            <MaterialIcons name="meeting-room" size={24} color="white" />
          )}
          {iconName === "device" && (
            <MaterialCommunityIcons name="connection" size={24} color="white" />
          )}
          <FontAwesome6 name="add" size={16} color="white" />
        </>
      }
      color="#3e31ab"
      style={[styles.fab, disabled && { backgroundColor: "grey" }]}
      onPress={onPress}
      visible={visible}
      disabled={disabled}
    />
  );
};

export default AddButton;

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    // paddingHorizontal: 8,
    right: 8,
    bottom: 8,
    backgroundColor: "#3e31ab",
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
  },
});
