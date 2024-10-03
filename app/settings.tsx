import InputField from "@/components/InputField";
import Tile from "@/components/Tile";
import useMobileStorageData from "@/hooks/useMobileStorageData";
import { useClerk } from "@clerk/clerk-expo";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BottomSheet, Button, Text, useTheme } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";

enum SettingOption {
  LogoutUser = "Logout User",
  LogoutHouse = "Logout House",
  AboutUs = "About Us",
}

interface SettingItem {
  option: SettingOption;
  label: React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onAction?: () => void;
}

const Settings = () => {
  const { signOut } = useClerk();
  const { data: ctrlDvcName } = useMobileStorageData("controller-device-name");
  const { data: ctrlDvcURL } = useMobileStorageData("controller-device-url");
  const [controllerDeviceName, setControllerDeviceName] = useState("");
  const [controllerDeviceURL, setControllerDeviceURL] = useState("");
  const [selectedSetting, setSelectedSetting] = useState<SettingItem | null>(
    null,
  );
  const { theme } = useTheme();

  useEffect(() => {
    if (ctrlDvcName) {
      setControllerDeviceName(ctrlDvcName);
    }
    if (ctrlDvcURL) {
      setControllerDeviceURL(ctrlDvcURL);
    }
  }, [ctrlDvcName, ctrlDvcURL]);

  const closeConfimation = () => {
    setSelectedSetting(null);
  };

  const settings: SettingItem[] = [
    {
      option: SettingOption.LogoutUser,
      label: "Logout User",
      iconLeft: <AntDesign name="logout" size={20} color="#6BE7FF" />,
      iconRight: (
        <MaterialIcons name="keyboard-arrow-right" size={24} color="grey" />
      ),
      onAction: () => {
        // logout();
        signOut();
      },
    },
    {
      option: SettingOption.LogoutHouse,
      label: "Logout House",
      iconLeft: (
        <FontAwesome6 name="house-circle-xmark" size={20} color="#6BE7FF" />
      ),
      iconRight: (
        <MaterialIcons name="keyboard-arrow-right" size={24} color="grey" />
      ),
      onAction: () => {},
    },
    {
      option: SettingOption.AboutUs,
      label: "About us",
      iconLeft: <Entypo name="info-with-circle" size={20} color="#6BE7FF" />,
      iconRight: (
        <MaterialIcons name="keyboard-arrow-right" size={24} color="grey" />
      ),
      onAction: () => {},
    },
  ];

  const getConfirmationMessage = () => {
    switch (selectedSetting?.option) {
      case SettingOption.LogoutUser:
        return "You want to logout this user?";
      case SettingOption.LogoutHouse:
        return "You want to logout from this house?";
      case SettingOption.AboutUs:
        return "You want to open external page for about us?";
      default:
        return "Are you Sure?";
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        paddingBottom: 90,
        backgroundColor: theme.colors.primary,
        gap: 20,
      }}
    >
      <InputField
        label="Controller Device Name"
        value={controllerDeviceName}
        disabled
      />
      <InputField
        label="Controller Device URL"
        value={controllerDeviceURL}
        disabled
      />
      {settings.map((setting, index) => {
        const Component = (
          <Tile key={index}>
            <View
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  justifyContent: "space-around",
                  alignItems: "center",
                  gap: 12,
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    width: 30,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {setting.iconLeft}
                </View>
                <Text>{setting.label}</Text>
              </View>

              {setting.iconRight}
            </View>
          </Tile>
        );

        return setting.onAction ? (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setSelectedSetting(setting);
            }}
          >
            {Component}
          </TouchableOpacity>
        ) : (
          Component
        );
      })}
      <BottomSheet
        isVisible={Boolean(selectedSetting)}
        onBackdropPress={closeConfimation}
      >
        <View
          style={{
            padding: 18,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            backgroundColor: theme.colors.secondary,
            gap: 18,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 16,
            }}
          >
            {selectedSetting?.iconLeft}
            <Text style={{ fontSize: 20 }}>{selectedSetting?.label}</Text>
          </View>
          <Text>{getConfirmationMessage()}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 16,
            }}
          >
            <Button onPress={closeConfimation}>Cancel</Button>
            <Button onPress={() => selectedSetting?.onAction?.()}>Yes</Button>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

export default Settings;
