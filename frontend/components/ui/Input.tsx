import React from "react";
import { TextInput, View, Text, StyleSheet, ViewStyle, TextInputProps } from "react-native";
import { useThemeTokens } from "../../src/core/design-system/ThemeContext";

interface InputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
}

export function Input({ label, error, containerStyle, inputStyle, ...rest }: InputProps) {
  const theme = useThemeTokens();
  const { colors, spacing, typography, radius } = theme;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { color: colors.text.secondary, marginBottom: spacing.xs, fontSize: typography.caption.fontSize }]}>{label}</Text>
      ) : null}
      <TextInput
        accessibilityLabel={label ?? rest.placeholder}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : colors.border,
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            fontSize: typography.body.fontSize,
            color: colors.text.primary,
          },
          inputStyle,
        ]}
        placeholderTextColor={colors.text.disabled}
        {...rest}
      />
      {error ? (
        <Text style={[styles.error, { color: colors.error, marginTop: spacing.xs, fontSize: typography.small.fontSize }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    minHeight: 44,
  },
  error: {},
});
