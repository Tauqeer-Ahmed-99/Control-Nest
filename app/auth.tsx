import NMTLogo from "@/assets/svgs/nmt-logo.svg";
import NMTSolutionsTextLogo from "@/components/NMTSolutionsTextLogo";
import useAuth from "@/hooks/useAuth";
import { Button, useTheme } from "@rneui/themed";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Auth() {
  const styles = useStyles();
  const { login } = useAuth();

  return (
    <View style={styles.container}>
      <View style={[styles.box, styles.shadow]}>
        <ExpoStatusBar translucent />
        <NMTLogo height={120} width={120} />
        <NMTSolutionsTextLogo />
        <Text style={styles.heading}>Home Automation System</Text>
      </View>
      <View style={styles.bottomSheet}>
        <Button
          size="lg"
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
          containerStyle={styles.buttonContainer}
          onPress={login}
        >
          Get Started
        </Button>
      </View>
    </View>
  );
}

const useStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
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
      backgroundColor: theme.colors.secondary,
      height: 120,
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
