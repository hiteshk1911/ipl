import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { ScreenLayout } from "../../../components/layout/ScreenLayout";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/layout/EmptyState";
import { ErrorState } from "../../../components/layout/ErrorState";
import { Skeleton } from "../../../components/ui/Skeleton";
import { useThemeTokens } from "../../core/design-system/ThemeContext";
import { useMatchInfo } from "../../domain/hooks/useMatchInfo";
import type { MatchInfoResponse } from "../../data/types";

interface MatchContextScreenProps {
  matchId?: number | string | null;
}

export function MatchContextScreen({ matchId: initialMatchId }: MatchContextScreenProps) {
  const theme = useThemeTokens();
  const [inputValue, setInputValue] = useState(initialMatchId != null ? String(initialMatchId) : "");
  const [submittedId, setSubmittedId] = useState<string | null>(initialMatchId != null ? String(initialMatchId) : null);
  const matchIdParam = initialMatchId != null ? (typeof initialMatchId === "string" ? parseInt(initialMatchId, 10) : initialMatchId) : null;
  const matchIdFromSubmit = submittedId ? parseInt(submittedId, 10) : null;
  const matchId = matchIdParam ?? matchIdFromSubmit;
  const enabled = (matchIdParam != null && !Number.isNaN(matchIdParam)) || (matchIdFromSubmit != null && !Number.isNaN(matchIdFromSubmit));

  const { data, isLoading, error, refetch } = useMatchInfo(matchId ?? undefined, enabled);

  const handleLoad = () => {
    const v = inputValue.trim();
    if (v && !Number.isNaN(parseInt(v, 10))) setSubmittedId(v);
  };

  if (initialMatchId == null && submittedId == null) {
    return (
      <ScreenLayout>
        <Text style={[styles.title, { color: theme.colors.text.primary, fontSize: theme.typography.h1.fontSize, marginBottom: theme.spacing.md }]}>
          Match Context
        </Text>
        <Input
          label="Match ID"
          placeholder="e.g. 335982"
          value={inputValue}
          onChangeText={setInputValue}
          keyboardType="number-pad"
          containerStyle={{ marginBottom: theme.spacing.md }}
        />
        <Button
          title="Load match"
          onPress={handleLoad}
          disabled={!inputValue.trim() || Number.isNaN(parseInt(inputValue.trim(), 10))}
        />
        <EmptyState message="Enter a match ID to see match information (season, venue, teams, date, toss)." />
      </ScreenLayout>
    );
  }

  if (enabled && isLoading && !data) {
    return (
      <ScreenLayout>
        <Skeleton width="100%" height={40} style={{ marginBottom: theme.spacing.sm }} />
        <Skeleton width="100%" height={120} />
      </ScreenLayout>
    );
  }

  if (enabled && error && !data) {
    return (
      <ScreenLayout>
        <ErrorState message={error} onRetry={refetch} />
      </ScreenLayout>
    );
  }

  if (!data) return null;

  const handleViewAnother = () => {
    setSubmittedId(null);
    setInputValue("");
  };

  return (
    <ScreenLayout>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: theme.spacing.xxl }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { marginBottom: theme.spacing.lg }]}>
          <Text style={[styles.title, { color: theme.colors.text.primary, fontSize: theme.typography.h1.fontSize, marginBottom: theme.spacing.xs }]}>
            Match {data.match_id}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary, fontSize: theme.typography.body.fontSize }]}>
            {data.season} • {data.venue}
          </Text>
          {submittedId != null && (
            <Button title="View another match" onPress={handleViewAnother} variant="outline" style={{ marginTop: theme.spacing.sm }} accessibilityLabel="View another match" />
          )}
        </View>

        <MatchInfoCard data={data} />
      </ScrollView>
    </ScreenLayout>
  );
}

function MatchInfoCard({ data }: { data: MatchInfoResponse }) {
  const theme = useThemeTokens();
  const { colors, spacing, typography } = theme;

  const infoRows: { label: string; value: string | null | undefined }[] = [
    { label: "Season", value: data.season },
    { label: "Venue", value: data.venue },
    { label: "Date", value: data.date ?? undefined },
  ];

  if (data.teams && typeof data.teams === "object") {
    const teamStr = Object.entries(data.teams)
      .map(([k, v]) => `${k}: ${v}`)
      .join(" • ");
    infoRows.push({ label: "Teams", value: teamStr });
  }

  if (data.toss && typeof data.toss === "object") {
    const tossStr = Object.entries(data.toss)
      .map(([k, v]) => `${k}: ${v}`)
      .join(" • ");
    infoRows.push({ label: "Toss", value: tossStr });
  }

  return (
    <Card style={[styles.card, { marginBottom: spacing.lg }]}>
      <Text style={[styles.sectionTitle, { color: colors.text.primary, fontSize: typography.h3.fontSize, marginBottom: spacing.md }]}>
        Match Information
      </Text>
      {infoRows.map((row) =>
        row.value ? (
          <View key={row.label} style={[styles.infoRow, { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.sm }]}>
            <Text style={[styles.infoLabel, { color: colors.text.secondary, fontSize: typography.body.fontSize }]}>{row.label}:</Text>
            <Text style={[styles.infoValue, { color: colors.text.primary, fontSize: typography.body.fontSize, fontWeight: "600", flex: 1, marginLeft: spacing.sm }]} numberOfLines={2}>
              {row.value}
            </Text>
          </View>
        ) : null
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {},
  header: {},
  title: { fontWeight: "bold" },
  subtitle: {},
  card: {},
  sectionTitle: { fontWeight: "600" },
  infoRow: {},
  infoLabel: {},
  infoValue: {},
});
