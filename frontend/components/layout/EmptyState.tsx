import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeTokens } from "../../src/core/design-system/ThemeContext";
import { Button } from "../ui/Button";

interface EmptyStateProps {
  message: string;
  ctaLabel?: string;
  onCtaPress?: () => void;
}

export function EmptyState({ message, ctaLabel, onCtaPress }: EmptyStateProps) {
  const theme = useThemeTokens();
  const { colors, spacing, typography } = theme;

  return (
    <View style={[styles.container, { padding: spacing.xl }]}>
      <Text style={[styles.message, { color: colors.text.secondary, fontSize: typography.body.fontSize, marginBottom: spacing.md }]}>
        {message}
      </Text>
      {ctaLabel && onCtaPress ? <Button title={ctaLabel} onPress={onCtaPress} variant="outline" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
  },
});
