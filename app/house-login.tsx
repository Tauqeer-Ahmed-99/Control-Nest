import NMTLogo from "@/assets/svgs/nmt-logo.svg";
import InputField from "@/components/InputField";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import NMTSolutionsTextLogo from "@/components/NMTSolutionsTextLogo";
import useHouseLogin from "@/hooks/useHouseLogin";
import useHouseMember from "@/hooks/useHouseMember";
import useMobileStorageData, {
  useMobileStorageMutation,
} from "@/hooks/useMobileStorageData";
import { getTypedRoute, Routes } from "@/routes/routes";
import { ResponseStatusCodes } from "@/utils/models";
import { useUser } from "@clerk/clerk-expo";
import { Button, Text, useTheme } from "@rneui/themed";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import React, { useEffect, useState } from "react";
import { StyleSheet, ToastAndroid, View } from "react-native";

const HouseLogin = () => {
  const [loginPressed, setLoginPressed] = useState(0);
  const [controllerDeviceName, setControllerDeviceName] = useState("");
  const [housePassword, setHousePassword] = useState("");
  const styles = useStyles();
  const { user } = useUser();
  const { data: controllerDeviceURL, isLoading: isControllerDeviceURLLoading } =
    useMobileStorageData("controller-device-url");
  const { data: houseMemberData, isLoading: isHouseMemberDataLoading } =
    useHouseMember({
      userId: user?.id as string,
    });
  const { mutate: houseLogin, isPending: isHouseLoggingIn } = useHouseLogin();
  const controllerDeviceNameStorageMutation = useMobileStorageMutation(
    "controller-device-name",
  );
  const controllerDeviceURLStorageMutation = useMobileStorageMutation(
    "controller-device-url",
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    if (
      houseMemberData?.status_code === ResponseStatusCodes.REQUEST_FULLFILLED &&
      Boolean(controllerDeviceURL)
    ) {
      router.replace(getTypedRoute(Routes.Home));
    }
  }, [houseMemberData, controllerDeviceURL]);

  useEffect(() => {
    if (controllerDeviceURL && housePassword) {
      houseLogin(
        {
          searchParams: {
            userId: user?.id,
            password: housePassword.trim(),
          },
        },
        {
          onSuccess: (res) => {
            if (res.status === "success") {
              router.replace(getTypedRoute(Routes.Home));
            } else {
              ToastAndroid.show(res.message, ToastAndroid.LONG);
            }
          },
          onError: (res) => {
            ToastAndroid.show(res.message, ToastAndroid.LONG);
          },
        },
      );
    }
  }, [controllerDeviceURL, loginPressed]);

  if (isControllerDeviceURLLoading || isHouseMemberDataLoading) {
    return (
      <View style={[styles.container, { gap: 50 }]}>
        <LoadingSkeleton height={200} width={200} borderRadius={12} />
        <LoadingSkeleton height={100} width={300} borderRadius={12} />
      </View>
    );
  }

  const handleHouseLogin = () => {
    controllerDeviceNameStorageMutation.mutate(controllerDeviceName.trim(), {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["mobile-storage", "controller-device-name"],
        });
        controllerDeviceURLStorageMutation.mutate(
          `http://${controllerDeviceName.trim()}.local:8000/`,
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: ["mobile-storage", "controller-device-url"],
              });
              setLoginPressed((prev) => prev + 1);
            },
            onError: (res) => {
              ToastAndroid.show(res.message, ToastAndroid.LONG);
            },
          },
        );
      },
      onError: (res) => {
        ToastAndroid.show(res.message, ToastAndroid.LONG);
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.box, styles.shadow]}>
        <ExpoStatusBar translucent />
        <NMTLogo height={120} width={120} />
        <NMTSolutionsTextLogo />
        <Text style={styles.heading}>Home Automation System</Text>
      </View>
      <View style={styles.bottomSheet}>
        <InputField
          label="Controller Username"
          placeholder="Enter controller username..."
          onChangeText={(value) => setControllerDeviceName(value)}
          disabled={
            isHouseLoggingIn ||
            controllerDeviceNameStorageMutation.isPending ||
            controllerDeviceURLStorageMutation.isPending
          }
        />
        <InputField
          label="House Password"
          placeholder="Enter house password..."
          onChangeText={(value) => setHousePassword(value)}
          disabled={
            isHouseLoggingIn ||
            controllerDeviceNameStorageMutation.isPending ||
            controllerDeviceURLStorageMutation.isPending
          }
        />
        <Button
          size="lg"
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
          containerStyle={styles.buttonContainer}
          onPress={handleHouseLogin}
          loading={
            isHouseLoggingIn ||
            controllerDeviceNameStorageMutation.isPending ||
            controllerDeviceURLStorageMutation.isPending
          }
        >
          Login
        </Button>
      </View>
    </View>
  );
};

export default HouseLogin;

const useStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "flex-start",
      position: "relative",
      paddingTop: 60,
    },
    box: {
      marginBottom: 120,
      padding: 24,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      gap: 24,
      backgroundColor: theme.colors.secondary,
    },
    shadow: {
      elevation: 100,
      shadowColor: "#3e31ab",
    },
    heading: {
      color: theme.colors.white,
      fontSize: 18,
      fontFamily: "Lexend_400Regular",
    },
    bottomSheet: {
      padding: 24,
      backgroundColor: theme.colors.secondary,
      // height: 120,
      width: "100%",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      position: "absolute",
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
    },
    button: {
      width: 240,
      borderRadius: 25,
      backgroundColor: "#3e31ab",
    },
    buttonContainer: {
      elevation: 20,
      borderRadius: 25,
      shadowColor: "#3e31ab",
    },
    buttonTitle: { fontFamily: "Lexend_400Regular" },
  });
};
