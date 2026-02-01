import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "../../../components/ui/Card";
import { StatCard } from "../../../components/ui/StatCard";
import { Badge } from "../../../components/ui/Badge";
import { useThemeTokens } from "../../core/design-system/ThemeContext";
import type { BatterBowlerMatchupResponse } from "../../data/types";

interface CompareMatchupCardProps {
  data: BatterBowlerMatchupResponse | null;
  error: string | null;
  bowlerName: string;
}

export function CompareMatchupCard({ data, error, bowlerName }: CompareMatchupCardProps) {
  const theme = useThemeTokens();
  const { colors, spacing, typography, radius } = theme;

  if (error) {
    return (
      <Card
        style={[
          styles.card,
          {
            marginBottom: spacing.md,
            padding: spacing.lg,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
          },
        ]}
      >
        <Text
          style={[
            styles.bowlerName,
            { color: colors.text.primary, fontSize: typography.h3.fontSize, fontWeight: "700", marginBottom: spacing.sm },
          ]}
        >
          {bowlerName}
        </Text>
        <Text style={[styles.error, { color: colors.error, fontSize: typography.body.fontSize }]}>{error}</Text>
      </Card>
    );
  }

  if (!data) return null;

  const { overall } = data;
  const advantage =
    overall.dismissals > 0 && overall.average != null
      ? overall.strike_rate > 120
        ? "Batter"
        : "Bowler"
      : overall.strike_rate > 120
        ? "Batter"
        : "Bowler";

  return (
    <Card
      style={[
        styles.card,
        {
          marginBottom: spacing.md,
          padding: spacing.lg,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
        },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: spacing.md,
            paddingBottom: spacing.sm,
            borderBottomWidth: 1,
            borderBottomColor: colors.divider,
          },
        ]}
      >
        <Text
          style={[
            styles.bowlerName,
            { color: colors.text.primary, fontSize: typography.h3.fontSize, fontWeight: "700" },
          ]}
        >
          {data.bowler}
        </Text>
        <Badge label={advantage} variant={advantage === "Batter" ? "success" : "error"} />
      </View>
      <View style={[styles.statsRow, { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }]}>
        <StatCard label="Runs" value={overall.runs} subtitle={`${overall.balls} balls`} accent />
        <StatCard label="SR" value={overall.strike_rate.toFixed(1)} />
        <StatCard label="Dismissals" value={overall.dismissals} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {},
  header: {},
  bowlerName: {},
  error: {},
  statsRow: {},
});
