import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import InputField from "./InputField";
import { Button, Text, useTheme } from "@rneui/themed";
import { StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";

const SignIn = ({
  nextStep,
  prevStep,
}: {
  nextStep: () => void;
  prevStep: () => void;
}) => {
  const {
    theme: {
      colors: { grey3 },
    },
  } = useTheme();
  const styles = useStyles();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        // router.replace("/");
      } else {
        setError(
          (signInAttempt as any)?.errors?.[0]?.longMessage ??
            (signInAttempt as any)?.errors?.[0]?.message ??
            "Something went wrong, Please try again later.",
        );
        console.log("ERROR", JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      if (isClerkAPIResponseError(err)) {
        setError(err.errors[0].longMessage ?? err.errors[0].message);
      }
      console.log("ERROR", JSON.stringify(err, null, 2));
    }
  }, [isLoaded, emailAddress, password]);
  return (
    <View style={{ width: "100%", padding: 32, justifyContent: "center" }}>
      <View style={styles.header}>
        <Text
          style={{
            fontFamily: "Lexend_600SemiBold",
            fontSize: 24,
          }}
        >
          Sign In
        </Text>
        <TouchableOpacity onPress={prevStep}>
          <Feather name="arrow-left" size={24} color={grey3} />
        </TouchableOpacity>
      </View>
      <InputField
        value={emailAddress}
        placeholder="Enter Email..."
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <InputField
        value={password}
        placeholder="Enter Password..."
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <Button
        title="Sign In"
        buttonStyle={styles.button}
        containerStyle={styles.buttonContainer}
        titleStyle={styles.buttonTitle}
        onPress={onSignInPress}
      />
      <Button
        buttonStyle={styles.secondaryButton}
        containerStyle={styles.buttonContainer}
        titleStyle={styles.secondaryButtonTitle}
        onPress={nextStep}
      >
        Don't have an account? Signup Instead.
      </Button>
    </View>
  );
};

export default SignIn;

const useStyles = () => {
  return StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    button: {
      width: 240,
      borderRadius: 25,
      backgroundColor: "#3e31ab",
    },
    secondaryButton: {
      marginTop: 16,
      width: 240,
      borderRadius: 25,
      backgroundColor: "transparent",
    },
    buttonContainer: {
      elevation: 20,
      borderRadius: 25,
      shadowColor: "#3e31ab",
      alignItems: "center",
    },
    buttonTitle: { fontFamily: "Lexend_400Regular" },
    secondaryButtonTitle: { fontFamily: "Lexend_400Regular", fontSize: 12 },
  });
};