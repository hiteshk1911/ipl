import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { useThemeTokens } from "../../src/core/design-system/ThemeContext";
import { Card } from "./Card";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  accent?: boolean;
  style?: ViewStyle;
}

export function StatCard({ label, value, subtitle, accent = false, style }: StatCardProps) {
  const theme = useThemeTokens();
  const { colors, spacing, typography, radius } = theme;

  return (
    <Card
      style={[
        styles.statCard,
        accent && {
          borderLeftWidth: 4,
          borderLeftColor: colors.primary,
          paddingLeft: spacing.md - 4,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: colors.text.secondary,
            marginBottom: spacing.xs,
            fontSize: typography.caption.fontSize,
            letterSpacing: 0.5,
          },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.value,
          {
            color: colors.text.primary,
            marginBottom: subtitle ? spacing.xs : 0,
            fontSize: typography.h2?.fontSize ?? 26,
            fontWeight: "700",
          },
        ]}
      >
        {value}
      </Text>
      {subtitle ? (
        <Text
          style={[
            styles.subtitle,
            {
              color: colors.text.secondary,
              fontSize: typography.small.fontSize,
            },
          ]}
        >
          {subtitle}
        </Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  statCard: {
    minWidth: "30%",
    flex: 1,
    maxWidth: "48%",
  },
  label: {
    textTransform: "uppercase",
    fontWeight: "500",
  },
  value: {},
  subtitle: {},
});
