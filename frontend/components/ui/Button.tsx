import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from "react-native";
import { useThemeTokens } from "../../src/core/design-system/ThemeContext";

type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export function Button({ title, onPress, variant = "primary", disabled = false, style, textStyle, accessibilityLabel }: ButtonProps) {
  const theme = useThemeTokens();
  const { colors, spacing, typography, radius } = theme;

  const dynamicStyle: ViewStyle = {
    backgroundColor: variant === "primary" ? colors.primary : variant === "secondary" ? colors.secondary : "transparent",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: variant === "outline" ? 2 : 0,
    borderColor: colors.primary,
    opacity: disabled ? 0.6 : 1,
  };

  const labelStyle: TextStyle = {
    color: variant === "outline" ? colors.primary : colors.text.white,
    fontSize: typography.body.fontSize,
    fontWeight: "600",
  };

  return (
    <TouchableOpacity style={[styles.base, dynamicStyle, style]} onPress={onPress} disabled={disabled} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? title}>
      <Text style={[labelStyle, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
});
