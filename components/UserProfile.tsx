import useAuth from "@/hooks/useAuth";
import { Image, Text, useTheme } from "@rneui/themed";
import { View } from "react-native";
import BorderContainer from "./BorderContainer";

const UserProfile = () => {
  const { userProfile } = useAuth();
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
              uri: "https://cdn.discordapp.com/attachments/294742173889331200/931174004641910824/me.jpg?ex=66d316df&is=66d1c55f&hm=7c35579b49b6d50b4115fcf258340279b4cc55b8413ffeef00d46582f8761762&",
            }}
            style={{ height: "100%", width: "100%", borderRadius: 35 }}
          />
        </BorderContainer>
        <View>
          <Text>Hello {userProfile?.given_name} 👋</Text>
          <Text style={{ color: "grey" }}>Welcome to your home.</Text>
        </View>
      </View>
    </View>
  );
};

export default UserProfile;
