import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import "react-native-reanimated";

import AuthContextProvider from "@/context/AuthContext";
import routes, { Routes } from "@/routes/routes";
import { ThemeProvider, createTheme } from "@rneui/themed";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Lexend_100Thin: require("@expo-google-fonts/lexend/Lexend_100Thin.ttf"),
    Lexend_200ExtraLight: require("@expo-google-fonts/lexend/Lexend_200ExtraLight.ttf"),
    Lexend_300Light: require("@expo-google-fonts/lexend/Lexend_300Light.ttf"),
    Lexend_400Regular: require("@expo-google-fonts/lexend/Lexend_400Regular.ttf"),
    Lexend_500Medium: require("@expo-google-fonts/lexend/Lexend_500Medium.ttf"),
    Lexend_600SemiBold: require("@expo-google-fonts/lexend/Lexend_600SemiBold.ttf"),
    Lexend_700Bold: require("@expo-google-fonts/lexend/Lexend_700Bold.ttf"),
    Lexend_800ExtraBold: require("@expo-google-fonts/lexend/Lexend_800ExtraBold.ttf"),
    Lexend_900Black: require("@expo-google-fonts/lexend/Lexend_900Black.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // const getHeaderLeft = (route: Route) => {
  // switch (route.path) {
  //   case Routes.Dashboard:
  //     return () => <NMTLogo height={30} width={30} style={{ margin: 12 }} />;
  //   default:
  //     return undefined;
  // }
  // };
  // const getHeaderRight = (route: Route) => {
  // switch (route.path) {
  //   case Routes.Dashboard:
  //     return () => <MenuList />;
  //   default:
  //     return undefined;
  // }
  // };

  const getHeaderBackgroundColor = (route: Routes) => {
    switch (route) {
      case Routes.Home:
        return "#3f3e45";
      default:
        return "#232228";
    }
  };

  const queryClient = new QueryClient();

  const theme = createTheme({
    lightColors: {
      primary: "#232228",
      secondary: "#3f3e45",
      success: "#6BE7FF",
      warning: "#FFF6B0",
      error: "#FE6CE6",
    },
    darkColors: { primary: "#232228", secondary: "#3f3e45" },
    components: {
      Text: {
        style: {
          color: "#ffffff",
          fontFamily: "Lexend_400Regular",
        },
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <SafeAreaProvider>
          <ThemeProvider theme={theme}>
            <Stack>
              {routes.map((route) => (
                <Stack.Screen
                  key={route.path}
                  name={route.path}
                  options={{
                    headerShown: route.showheader ?? false,
                    headerTintColor: "#ffffff",
                    headerTitle: route.label,
                    headerTitleAlign: "center",
                    // headerLeft: getHeaderLeft(route),
                    // headerRight: getHeaderRight(route),
                    headerShadowVisible: false,
                    headerTitleStyle: {
                      color: "#fff",
                      fontFamily: "Lexend_500Medium",
                    },
                    headerStyle: {
                      backgroundColor: getHeaderBackgroundColor(route.path),
                    },
                    statusBarTranslucent: true,
                  }}
                />
              ))}
            </Stack>
          </ThemeProvider>
        </SafeAreaProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}
