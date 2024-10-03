import { Button, Text, useTheme } from "@rneui/themed";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { isClerkAPIResponseError, useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import InputField from "./InputField";

const SignUp = ({ prevStep }: { prevStep: () => void }) => {
  const {
    theme: {
      colors: { grey3 },
    },
  } = useTheme();

  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
      setError("");
    } catch (err: any) {
      if (isClerkAPIResponseError(err)) {
        setError(err.errors[0].longMessage ?? err.errors[0].message);
      }
      console.log("ERROR", JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });

        // router.replace("/");
      } else {
        setError(
          (completeSignUp as any)?.errors?.[0]?.longMessage ??
            (completeSignUp as any)?.errors?.[0]?.message ??
            "Something went wrong, Please try again later.",
        );
        console.log("ERROR", JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      if (isClerkAPIResponseError(err))
        setError(err.errors[0].longMessage ?? err.errors[0].message);
      console.log("ERROR", JSON.stringify(err, null, 2));
    }
  };

  return (
    <View style={{ width: "100%", padding: 32, justifyContent: "center" }}>
      <View style={styles.header}>
        <Text
          style={{
            fontFamily: "Lexend_600SemiBold",
            fontSize: 24,
          }}
        >
          Sign Up
        </Text>
        <TouchableOpacity onPress={prevStep}>
          <Feather name="arrow-left" size={24} color={grey3} />
        </TouchableOpacity>
      </View>
      {!pendingVerification && (
        <>
          <InputField
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email..."
            onChangeText={(email) => setEmailAddress(email)}
          />
          <InputField
            value={password}
            placeholder="Password..."
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          <Button
            title="Sign Up"
            buttonStyle={styles.button}
            containerStyle={styles.buttonContainer}
            titleStyle={styles.buttonTitle}
            onPress={onSignUpPress}
          />
        </>
      )}
      {error && (
        <Text style={{ textAlign: "center", color: "red", marginTop: 16 }}>
          {error}
        </Text>
      )}
      {pendingVerification && (
        <>
          <InputField
            value={code}
            placeholder="Code..."
            onChangeText={(code) => setCode(code)}
          />
          <Button
            title="Verify Email"
            buttonStyle={styles.button}
            containerStyle={styles.buttonContainer}
            titleStyle={styles.buttonTitle}
            onPress={onPressVerify}
          />
        </>
      )}

      <Button
        buttonStyle={styles.secondaryButton}
        containerStyle={styles.buttonContainer}
        titleStyle={styles.secondaryButtonTitle}
        onPress={prevStep}
      >
        Already have an account? Login Instead.
      </Button>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
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
