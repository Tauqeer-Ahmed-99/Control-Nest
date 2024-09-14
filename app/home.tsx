import BottomNavigation from "@/components/BottomNavigation";
import Rooms from "@/components/Rooms";
import Summary from "@/components/Summary";
import UserProfile from "@/components/UserProfile";
import useUpdateHeaderTitle from "@/hooks/useUpdateHeaderTitle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, useTheme } from "@rneui/themed";
import { useQueryClient } from "@tanstack/react-query";
import { TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-virtualized-view";

const Home = () => {
  const { theme } = useTheme();
  const queryClient = useQueryClient();

  const DevelopmentHelpers = (
    <TouchableOpacity
      onPress={async () => {
        await AsyncStorage.multiRemove([
          "controller-device-name",
          "controller-device-url",
        ]);
        queryClient.invalidateQueries({
          queryKey: ["mobile-storage", "controller-device-name"],
        });
        queryClient.invalidateQueries({
          queryKey: ["mobile-storage", "controller-device-url"],
        });
      }}
    >
      <Text>Clear Mobile Storage</Text>
    </TouchableOpacity>
  );
  useUpdateHeaderTitle(
    "Home",
    process.env.NODE_ENV === "development" ? DevelopmentHelpers : undefined,
  );
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.primary,
      }}
    >
      <UserProfile />
      <View style={{ paddingHorizontal: 18, flex: 1, paddingBottom: 90 }}>
        <ScrollView>
          <Summary />
          <Rooms />
        </ScrollView>
      </View>
      <BottomNavigation />
    </View>
  );
};

export default Home;
