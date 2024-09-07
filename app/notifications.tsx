import BottomNavigation from "@/components/BottomNavigation";
import { Text, useTheme } from "@rneui/themed";
import React from "react";
import { View } from "react-native";

const Notifications = () => {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.primary,
      }}
    >
      <Text>Notifications</Text>
      <BottomNavigation />
    </View>
  );
};

export default Notifications;
