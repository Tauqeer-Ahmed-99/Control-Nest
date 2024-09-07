import { Text } from "@rneui/themed";
import React from "react";
import { View } from "react-native";

const NoDataAvailable = (props: { title: string; description?: string }) => {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "800" }}>{props.title}</Text>
      {props.description && (
        <Text style={{ textAlign: "center" }}>{props.description}</Text>
      )}
    </View>
  );
};

export default NoDataAvailable;
