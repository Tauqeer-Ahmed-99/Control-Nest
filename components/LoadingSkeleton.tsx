import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Easing } from "react-native";

const LoadingSkeleton = ({
  height,
  width,
  borderRadius,
  startOpacity,
}: {
  height?: number;
  width?: number;
  borderRadius?: number;
  startOpacity?: number;
}) => {
  const fadeAnim = useRef(new Animated.Value(startOpacity ?? 0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: startOpacity ?? 0.3,
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { height: height ?? 100, width: width ?? "100%", borderRadius },
        { opacity: fadeAnim },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#d1d1d1",
    borderRadius: 4,
  },
});

export default LoadingSkeleton;
