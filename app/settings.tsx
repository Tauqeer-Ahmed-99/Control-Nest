import BottomNavigation from "@/components/BottomNavigation";
import { Text, useTheme } from "@rneui/themed";
import React from "react";
import { View } from "react-native";

const Settings = () => {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        paddingBottom: 90,
        backgroundColor: theme.colors.primary,
      }}
    >
      <Text>Settings</Text>
      {/* <BottomNavigation /> */}
    </View>
  );
};

export default Settings;
