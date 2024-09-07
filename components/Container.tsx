import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Skeleton } from "@rneui/themed";
import { useQueryClient, UseQueryResult } from "@tanstack/react-query";
import {
  GestureHandlerRootView,
  RefreshControl,
} from "react-native-gesture-handler";
import { Text } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { ApiRoutes } from "@/routes/routes";
import { ScrollView } from "react-native-virtualized-view";

const Container = ({
  queryResult,
  children,
}: {
  queryResult?: UseQueryResult;
  children: React.ReactNode;
}) => {
  const queryClient = useQueryClient();

  const renderChildren = () => {
    if (queryResult?.status === "pending") {
      return (
        <>
          {[...new Array(6)].map((_, idx) => (
            <Skeleton
              key={idx}
              LinearGradientComponent={LinearGradient}
              animation="wave"
              style={styles.skeleton}
            />
          ))}
        </>
      );
    } else if (queryResult?.status === "error") {
      return (
        <View style={styles.errorContainer}>
          <Text>Something went wrong, please try again later.</Text>
          <Text>{queryResult.error.cause as string}</Text>
          <Text>{queryResult.error.message}</Text>
        </View>
      );
    }
    return children;
  };

  return (
    <View style={{ height: "100%" }}>
      <GestureHandlerRootView>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={queryResult?.isFetching ?? false}
              onRefresh={() =>
                queryClient.invalidateQueries({
                  queryKey: [ApiRoutes.UserHouses],
                })
              }
            />
          }
        >
          <View style={styles.container}>{renderChildren()}</View>
        </ScrollView>
      </GestureHandlerRootView>
    </View>
  );
};

export default Container;

const styles = StyleSheet.create({
  container: {
    padding: 18,
    gap: 16,
  },
  skeleton: { height: 100, borderRadius: 12 },
  errorContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
