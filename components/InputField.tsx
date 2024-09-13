import React, { RefObject } from "react";
import { StyleSheet } from "react-native";
import { Input, useTheme } from "@rneui/themed";

const InputField = ({
  label,
  placeholder,
  value,
  defaultValue,
  onChangeText,
  disabled,
}: {
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChangeText?: (text: string) => void;
  disabled?: boolean;
}) => {
  const {
    theme: {
      colors: { white },
    },
  } = useTheme();

  return (
    <Input
      label={label}
      labelStyle={[styles.labelStyle, { color: white }]}
      placeholder={placeholder}
      placeholderTextColor="#6e6b8c"
      inputStyle={styles.inputStyle}
      inputContainerStyle={styles.inputContainerStyle}
      leftIcon={{
        type: "feather",
        name: "edit-3",
        color: "#6e6b8c",
        size: 20,
      }}
      value={value}
      defaultValue={defaultValue}
      onChangeText={onChangeText}
      disabled={disabled}
    />
  );
};

const styles = StyleSheet.create({
  inputContainerStyle: {
    backgroundColor: "#2e2c49",
    borderRadius: 10,
    borderBottomWidth: 0, // Removes the underline by default
    paddingHorizontal: 10,
  },
  labelStyle: {
    marginLeft: 8,
    marginBottom: 8,
    fontSize: 14,
  },
  inputStyle: {
    color: "#fff",
    fontSize: 16,
  },
});

export default InputField;
