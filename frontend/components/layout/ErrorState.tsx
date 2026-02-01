import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeTokens } from "../../src/core/design-system/ThemeContext";
import { Button } from "../ui/Button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  retryButtonLabel?: string;
}

export function ErrorState({ message, onRetry, retryButtonLabel = "Retry" }: ErrorStateProps) {
  const theme = useThemeTokens();
  const { colors, spacing, typography } = theme;

  return (
    <View style={[styles.container, { padding: spacing.xl }]}>
      <Text style={[styles.message, { color: colors.error, fontSize: typography.body.fontSize, marginBottom: spacing.md }]}>{message}</Text>
      {onRetry ? <Button title={retryButtonLabel} onPress={onRetry} variant="outline" /> : null}
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
