import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Divider, Menu, TouchableRipple } from "react-native-paper";
import useAuth from "@/hooks/useAuth";
import { useTheme } from "@rneui/themed";

const MenuList = () => {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const { logout } = useAuth();
  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <TouchableRipple
          onPress={() => setVisible(true)}
          borderless
          style={{
            height: 40,
            width: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="more-vertical" size={24} color={theme.colors.white} />
        </TouchableRipple>
      }
      style={{ marginTop: 60 }}
    >
      <Menu.Item onPress={() => {}} title="Item 1" />
      <Menu.Item onPress={() => {}} title="Item 2" />
      <Divider />
      <Menu.Item onPress={() => logout()} title="Logout" />
    </Menu>
  );
};

export default MenuList;
