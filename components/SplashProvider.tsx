import NMTLogo from "@/assets/svgs/nmt-logo.svg";
import { useAuth } from "@clerk/clerk-expo";
import { Text, useTheme } from "@rneui/themed";
import { SplashScreen } from "expo-router";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { StatusBar, View } from "react-native";

const SplashProvider = ({
  isFontsLoaded,
  children,
}: { isFontsLoaded: boolean } & PropsWithChildren) => {
  const { isLoaded: isAuthLoaded } = useAuth();
  const {
    theme: {
      colors: { primary },
    },
  } = useTheme();
  const [dots, setDots] = useState("");

  useEffect(() => {
    setInterval(() => {
      setDots((currDots) => (currDots.length < 3 ? `${currDots}.` : ""));
    }, 1000);
  }, []);

  useEffect(() => {
    if (isFontsLoaded && isAuthLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isFontsLoaded, isAuthLoaded]);

  if (!isFontsLoaded || !isAuthLoaded) {
    return (
      <View
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: primary,
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
        }}
      >
        <StatusBar translucent />
        <NMTLogo height={120} width={120} />
        <Text>Initializing {dots}</Text>
      </View>
    );
  }

  return children;
};

export default SplashProvider;
