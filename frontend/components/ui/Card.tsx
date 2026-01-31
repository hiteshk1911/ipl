import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { useThemeTokens } from "../../src/core/design-system/ThemeContext";

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, style }: CardProps) {
  const theme = useThemeTokens();
  const { colors, spacing, radius, shadows } = theme;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          padding: spacing.md,
          marginVertical: spacing.sm,
          ...shadows.md,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {},
});
