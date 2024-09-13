import BottomNavigation from "@/components/BottomNavigation";
import { Text, useTheme } from "@rneui/themed";
import React from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-virtualized-view";

const Notifications = () => {
  const { theme } = useTheme();

  const notifications: string[] = [
    "User 1 turned on the smart light.",
    "User 2 turned off the fan.",
    "User 1 turned on the smart light, turned off the fan and scheduled the motor to run every sunday to saturday 7:00 am.",
    "User 1 turned on the smart light.",
    "User 2 turned off the fan.",
    "User 1 turned on the smart light, turned off the fan and scheduled the motor to run every sunday to saturday 7:00 am.",
    "User 1 turned on the smart light.",
    "User 2 turned off the fan.",
    "User 1 turned on the smart light, turned off the fan and scheduled the motor to run every sunday to saturday 7:00 am.",
    "User 1 turned on the smart light.",
    "User 2 turned off the fan.",
    "User 1 turned on the smart light, turned off the fan and scheduled the motor to run every sunday to saturday 7:00 am.",
    "User 1 turned on the smart light.",
    "User 2 turned off the fan.",
    "User 1 turned on the smart light, turned off the fan and scheduled the motor to run every sunday to saturday 7:00 am.",
  ];
  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        paddingBottom: 90,
        backgroundColor: theme.colors.primary,
      }}
    >
      <ScrollView>
        <View style={{ gap: 16 }}>
          {notifications.map((notif, idx) => (
            <View
              key={idx}
              style={{
                backgroundColor: theme.colors.secondary,
                padding: 8,
                borderRadius: 12,
              }}
            >
              <Text style={{ flexWrap: "wrap" }}>{notif}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomNavigation />
    </View>
  );
};

export default Notifications;
