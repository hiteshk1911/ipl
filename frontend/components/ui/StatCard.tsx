import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { Colors } from "../../constants/colors";
import { Spacing } from "../../constants/spacing";
import { Card } from "./Card";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  style?: ViewStyle;
}

export function StatCard({ label, value, subtitle, style }: StatCardProps) {
  return (
    <Card style={{ ...styles.statCard, ...(style || {}) }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
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
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});
