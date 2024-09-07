import useAuth from "@/hooks/useAuth";
import useHouseMember from "@/hooks/useHouseMember";
import { ResponseStatusCodes } from "@/utils/models";
import { Text } from "@rneui/themed";
import React from "react";
import { View } from "react-native";

const HouseLogin = () => {
  return (
    <View>
      <Text>Login to house</Text>
    </View>
  );
};

const Home = () => {
  const { userProfile } = useAuth();
  return (
    <View>
      <Text>Hello {userProfile?.given_name} 👋</Text>
    </View>
  );
};

const Dashboard = () => {
  const { userProfile } = useAuth();
  const d = useHouseMember({
    userId: userProfile?.id as string,
  });
  const { data, error, isPending } = d;

  if (isPending) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View>
        <Text>{error.message}</Text>
      </View>
    );
  }

  if (data.status_code !== ResponseStatusCodes.REQUEST_FULLFILLED)
    return <HouseLogin />;

  return <Home />;
};

export default Dashboard;
