import { Text } from "@rneui/themed";
import React from "react";
import { View } from "react-native";

import useAuth from "@/hooks/useAuth";
import useHouse from "@/hooks/useHouse";
import Grid from "./Grid";
import Header from "./Header";
import RoomCard from "./RoomCard";

const Rooms = () => {
  const { userProfile } = useAuth();
  const { data, isPending, error } = useHouse({
    userId: userProfile?.id as string,
  });

  if (isPending) {
    return (
      <View>
        <Text>Loading ...</Text>
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

  const {
    data: { rooms },
  } = data;

  return (
    <View>
      <Header heading="Rooms" onDetails={() => {}} />
      <Grid
        items={rooms}
        renderItem={(room) => <RoomCard key={room.room_id} room={room} />}
        rowGap={30}
      />
    </View>
  );
};

export default Rooms;
