import { View } from "react-native";
import { Text, useTheme } from "@rneui/themed";
import UserProfile from "@/components/UserProfile";
import useAuth from "@/hooks/useAuth";
import useHouseMember from "@/hooks/useHouseMember";
import { ResponseStatusCodes } from "@/utils/models";
import Summary from "@/components/Summary";
import { ScrollView } from "react-native-virtualized-view";
import Rooms from "@/components/Rooms";
import BottomNavigation from "@/components/BottomNavigation";

const HouseLogin = () => {
  return (
    <View>
      <Text>Login to house</Text>
    </View>
  );
};

const HousePage = () => {
  const { theme } = useTheme();
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

const Home = () => {
  const { userProfile } = useAuth();
  const {
    data: houseMemberData,
    error: houseMemberError,
    isPending: isPendingHouseMemberDataa,
  } = useHouseMember({
    userId: userProfile?.id as string,
  });

  if (isPendingHouseMemberDataa) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!houseMemberData) {
    return (
      <View>
        <Text>{houseMemberError.message}</Text>
      </View>
    );
  }

  if (houseMemberData.status_code !== ResponseStatusCodes.REQUEST_FULLFILLED)
    return <HouseLogin />;

  return <HousePage />;
};

export default Home;
