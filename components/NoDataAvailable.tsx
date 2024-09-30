import { Text } from "@rneui/themed";
import React from "react";
import { View } from "react-native";
import MessageContainer from "./MessageContainer";

const NoDataAvailable = (props: { title: string; description?: string }) => {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MessageContainer message={props.title}>
        {props.description && (
          <Text style={{ textAlign: "center" }}>{props.description}</Text>
        )}
      </MessageContainer>
    </View>
  );
};

export default NoDataAvailable;
