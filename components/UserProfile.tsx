import { useUser } from "@clerk/clerk-expo";
import { Image, Text, useTheme } from "@rneui/themed";
import { View } from "react-native";
import BorderContainer from "./BorderContainer";

const UserProfile = () => {
  const { user } = useUser();
  const { theme } = useTheme();

  return (
    <View
      style={{
        height: 150,
        justifyContent: "flex-end",
        backgroundColor: theme.colors.secondary,
      }}
    >
      <View
        style={{
          width: "100%",
          height: 125,
          backgroundColor: theme.colors.primary,
          position: "relative",
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: 100,
            width: 100,
            borderRadius: 50,
            backgroundColor: theme.colors.primary,
            position: "absolute",
            top: -25,
            left: "50%",
            transform: [{ translateX: -50 }],
          }}
        ></View>
        <BorderContainer
          whiteBorder
          style={{
            height: 70,
            width: 70,
            borderRadius: 35,
            bottom: 15,
          }}
        >
          <Image
            source={{
              uri: user?.imageUrl,
            }}
            style={{ height: "100%", width: "100%", borderRadius: 35 }}
          />
        </BorderContainer>
        <View>
          <Text style={{ textAlign: "center" }}>Hello {user?.fullName} 👋</Text>
          <Text style={{ color: "grey", textAlign: "center" }}>
            Welcome to your home.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default UserProfile;
