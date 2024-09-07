import React, { useEffect, useRef } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useTheme } from "@rneui/themed";

interface SwitchProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ value, onChange }) => {
  const {
    theme: {
      colors: { primary, secondary },
    },
  } = useTheme();

  const animationValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: value ? 1 : 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const toggleSwitch = () => {
    Animated.timing(animationValue, {
      toValue: value ? 0 : 1,
      duration: 100,
      useNativeDriver: false,
    }).start(() => {
      onChange(!value);
    });
  };

  const switchColor = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [secondary, "#52E2C7"],
  });

  const circleColor = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [primary, "#3eb9a2"],
  });

  const powerIconColor = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#a3a3a3", "#ffffff"],
  });

  const iconTranslate = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 33],
  });

  return (
    <TouchableWithoutFeedback onPress={toggleSwitch}>
      <Animated.View
        style={[styles.container, { backgroundColor: switchColor }]}
      >
        <Animated.View
          style={[
            styles.circle,
            {
              backgroundColor: circleColor,
              transform: [{ translateX: iconTranslate }],
            },
          ]}
        >
          <View style={styles.icon}>
            <Animated.Text style={{ color: powerIconColor }}>
              <Feather name="power" size={12} />
            </Animated.Text>
          </View>
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 65,
    height: 32,
    borderRadius: 16,
    padding: 4,
    justifyContent: "center",
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    // Style for the icon inside the circle
  },
});

export default Switch;
