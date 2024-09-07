import React from "react";
import { useWindowDimensions, View } from "react-native";
import BorderContainer from "./BorderContainer";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, usePathname } from "expo-router";
import { TouchableOpacity } from "react-native";
import { getTypedRoute } from "@/routes/routes";
import { useTheme } from "@rneui/themed";

const bottomNavItems: {
  name: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}[] = [
  {
    name: "home",
    label: "Home",
    path: "/home",
    icon: <MaterialIcons name="home-filled" size={24} color="white" />,
  },
  {
    name: "devices",
    label: "Devices",
    path: "/devices",
    icon: <MaterialIcons name="devices" size={24} color="white" />,
  },
  {
    name: "create",
    label: "Create",
    path: "/create",
    icon: <MaterialIcons name="add" size={30} color="white" />,
  },
  {
    name: "notifications",
    label: "Notifications",
    path: "/notifications",
    icon: <MaterialIcons name="notifications" size={24} color="white" />,
  },
  {
    name: "settings",
    label: "Settings",
    path: "/settings",
    icon: <MaterialIcons name="settings" size={24} color="white" />,
  },
];

const BottomNavigation = () => {
  const {
    theme: {
      colors: { secondary },
    },
  } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const bottomNavIslandWidth = windowWidth - 32;

  const pathname = usePathname();

  return (
    <View
      style={{
        marginHorizontal: 16,
        position: "absolute",
        bottom: 16,
        zIndex: 999,
        height: 70,
        width: bottomNavIslandWidth,
        backgroundColor: secondary,
        opacity: 0.8,
        borderRadius: 35,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      {bottomNavItems.map((navItem) =>
        pathname === navItem.path || navItem.path === "/create" ? (
          <TouchableOpacity
            key={navItem.label}
            onPress={navItem.path === "/create" ? () => {} : undefined}
          >
            <BorderContainer
              borderWidth={2}
              style={{
                height: 35,
                width: 35,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {navItem.icon}
            </BorderContainer>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            key={navItem.label}
            onPress={() => router.replace(getTypedRoute(navItem.path))}
          >
            <View
              style={{
                height: 35,
                width: 35,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {navItem.icon}
            </View>
          </TouchableOpacity>
        ),
      )}
    </View>
  );
};

export default BottomNavigation;
