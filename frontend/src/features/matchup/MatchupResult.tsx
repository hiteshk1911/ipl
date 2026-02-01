import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Card } from "../../../components/ui/Card";
import { StatCard } from "../../../components/ui/StatCard";
import { Badge } from "../../../components/ui/Badge";
import { useThemeTokens } from "../../core/design-system/ThemeContext";
import { PhaseBreakdownView } from "./PhaseBreakdown";
import type { BatterBowlerMatchupResponse, RecentEncounter } from "../../data/types";
import { router } from "expo-router";

interface MatchupResultProps {
  data: BatterBowlerMatchupResponse;
}

export function MatchupResult({ data }: MatchupResultProps) {
  const theme = useThemeTokens();
  const { colors, spacing, typography, radius } = theme;
  const { batter, bowler, overall, phase_breakdown, recent_encounters } = data;

  const confidence = overall.confidence_score;
  const confidenceLabel = confidence != null ? (confidence > 70 ? "High" : confidence > 50 ? "Medium" : "Low") : null;
  const confidenceVariant = confidence != null ? (confidence > 70 ? "success" : confidence > 50 ? "warning" : "error") : "primary";

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, { padding: spacing.md }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { marginBottom: spacing.lg }]}>
        <Text style={[styles.subtitle, { color: colors.text.secondary, fontSize: typography.body.fontSize }]}>
          {batter} vs {bowler}
        </Text>
      </View>

      {confidence != null && (
        <Card style={[styles.confidenceSection, { marginBottom: spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary, fontSize: typography.h3.fontSize, marginBottom: spacing.sm }]}>
            Confidence Score
          </Text>
          <View style={[styles.confidenceBadge, { gap: spacing.sm, flexDirection: "row", alignItems: "center" }]}>
            <Text style={[styles.confidenceValue, { color: colors.primary, fontSize: typography.h1.fontSize, fontWeight: "700" }]}>{confidence}%</Text>
            {confidenceLabel && <Badge label={confidenceLabel} variant={confidenceVariant} />}
          </View>
        </Card>
      )}

      <View style={[styles.statsGrid, { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: spacing.lg, gap: spacing.sm }]}>
        <StatCard label="Total Runs" value={overall.runs} subtitle={`${overall.balls} balls`} accent />
        <StatCard label="Strike Rate" value={overall.strike_rate.toFixed(1)} subtitle="Overall" />
        <StatCard label="Dismissals" value={overall.dismissals} subtitle="Times out" />
      </View>

      <PhaseBreakdownView phaseBreakdown={phase_breakdown ?? undefined} />

      {recent_encounters.length > 0 && (
        <Card style={[styles.recentCard, { marginBottom: spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary, fontSize: typography.h3.fontSize, marginBottom: spacing.md }]}>
            Recent Encounters
          </Text>
          {recent_encounters.map((enc: RecentEncounter, index: number) => (
            <TouchableOpacity
              key={`${enc.match_id}-${index}`}
              style={[styles.matchRow, { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.divider }]}
              onPress={() => router.push({ pathname: "/match-context", params: { match_id: String(enc.match_id) } })}
              activeOpacity={0.7}
            >
              <View style={styles.matchInfo}>
                <Text style={[styles.matchRuns, { fontSize: typography.body.fontSize, fontWeight: "600", color: colors.text.primary }]}>
                  {enc.runs} runs
                </Text>
                <Text style={[styles.matchBalls, { fontSize: typography.caption.fontSize, color: colors.text.secondary }]}>
                  {enc.balls} balls • {enc.season}
                </Text>
              </View>
              <Badge label={enc.dismissed ? "Out" : "Not Out"} variant={enc.dismissed ? "error" : "success"} />
            </TouchableOpacity>
          ))}
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {},
  header: {},
  subtitle: {},
  confidenceSection: {},
  sectionTitle: {
    fontWeight: "600",
  },
  confidenceBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  confidenceValue: {
    fontWeight: "bold",
  },
  statsGrid: {},
  recentCard: {},
  matchRow: {},
  matchInfo: {},
  matchRuns: {},
  matchBalls: {},
});
