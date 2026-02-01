import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "../../../components/ui/Card";
import { useThemeTokens } from "../../core/design-system/ThemeContext";
import type { PhaseStats } from "../../data/types";

interface PhaseBreakdownProps {
  phaseBreakdown: Record<string, PhaseStats> | null | undefined;
}

const PHASE_LABELS: Record<string, string> = {
  powerplay: "Powerplay",
  middle: "Middle",
  death: "Death",
};

export function PhaseBreakdownView({ phaseBreakdown }: PhaseBreakdownProps) {
  const theme = useThemeTokens();
  const { colors, spacing, typography, radius } = theme;

  if (!phaseBreakdown || Object.keys(phaseBreakdown).length === 0) return null;

  const phases = Object.entries(phaseBreakdown);

  return (
    <Card style={[styles.card, { marginBottom: spacing.lg }]}>
      <Text style={[styles.sectionTitle, { color: colors.text.primary, fontSize: typography.h3.fontSize, marginBottom: spacing.md }]}>
        Phase-wise Performance
      </Text>
      <View style={[styles.phaseRow, { gap: spacing.sm }]}>
        {phases.map(([key, stats]) => (
          <View
            key={key}
            style={[
              styles.phaseBlock,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                borderRadius: radius.md,
                padding: spacing.md,
                borderWidth: 1,
                flex: 1,
              },
            ]}
          >
            <Text style={[styles.phaseLabel, { color: colors.text.secondary, fontSize: typography.small.fontSize, marginBottom: spacing.xs }]}>
              {PHASE_LABELS[key] ?? key}
            </Text>
            <Text style={[styles.phaseValue, { color: colors.text.primary, fontSize: typography.h3.fontSize, fontWeight: "600", marginBottom: spacing.xs }]}>
              {stats.runs} runs
            </Text>
            <Text style={[styles.phaseSR, { color: colors.text.secondary, fontSize: typography.small.fontSize }]}>
              SR: {stats.strike_rate.toFixed(1)}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {},
  sectionTitle: {
    fontWeight: "600",
  },
  phaseRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  phaseBlock: {
    alignItems: "center",
    minWidth: 90,
  },
  phaseLabel: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  phaseValue: {},
  phaseSR: {},
});
