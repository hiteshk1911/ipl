import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";
import { Spacing } from "../../constants/spacing";

interface BadgeProps {
  label: string;
  variant?: "primary" | "secondary" | "success" | "warning" | "error";
}

export function Badge({ label, variant = "primary" }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[variant]]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.secondary,
  },
  success: {
    backgroundColor: Colors.secondary,
  },
  warning: {
    backgroundColor: Colors.warning,
  },
  error: {
    backgroundColor: Colors.error,
  },
  text: {
    color: Colors.text.white,
    fontSize: 12,
    fontWeight: "600",
  },
});
