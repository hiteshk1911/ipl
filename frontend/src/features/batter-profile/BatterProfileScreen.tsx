import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { ScreenLayout } from "../../../components/layout/ScreenLayout";
import { Card } from "../../../components/ui/Card";
import { StatCard } from "../../../components/ui/StatCard";
import { Badge } from "../../../components/ui/Badge";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import { EmptyState } from "../../../components/layout/EmptyState";
import { ErrorState } from "../../../components/layout/ErrorState";
import { Skeleton } from "../../../components/ui/Skeleton";
import type { SeasonProfile } from "../../data/types";
import type { RecentMatch } from "../../data/types";
import { useThemeTokens } from "../../core/design-system/ThemeContext";
import { usePlayerSearch } from "../../domain/hooks/usePlayerSearch";
import { useBatterProfile, useBatterSeasons, useBatterRecentForm } from "../../domain/hooks/useBatterProfile";
import { router } from "expo-router";
import { formatAverage } from "../../core/utils/format";

interface BatterProfileScreenProps {
  batterName?: string | null;
}

const MAX_RETRIES = 3;

export function BatterProfileScreen({ batterName: initialBatter }: BatterProfileScreenProps) {
  const theme = useThemeTokens();
  const [query, setQuery] = useState(initialBatter ?? "");
  const [selectedBatter, setSelectedBatter] = useState(initialBatter?.trim() ?? "");
  const [seasonFilter, setSeasonFilter] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const defaultSeasonSetRef = useRef(false);

  const search = usePlayerSearch(query, true);
  const profile = useBatterProfile(selectedBatter, !!selectedBatter);
  const seasons = useBatterSeasons(selectedBatter, seasonFilter, !!selectedBatter);
  const recentForm = useBatterRecentForm(selectedBatter, 5, null, !!selectedBatter);

  const handleClear = useCallback(() => {
    setQuery("");
    setSelectedBatter("");
    setSeasonFilter(null);
    setRetryCount(0);
    defaultSeasonSetRef.current = false;
  }, []);

  const seasonList = seasons.data?.seasons ?? [];
  useEffect(() => {
    setSeasonFilter(null);
    setRetryCount(0);
    defaultSeasonSetRef.current = false;
  }, [selectedBatter]);
  useEffect(() => {
    if (seasonList.length > 0 && !defaultSeasonSetRef.current) {
      const latest = [...seasonList].sort((a, b) => Number(b.season) - Number(a.season))[0]?.season ?? null;
      if (latest) {
        setSeasonFilter(latest);
        defaultSeasonSetRef.current = true;
      }
    }
  }, [seasonList, selectedBatter]);

  const hasBatter = !!selectedBatter;
  const isLoading = profile.isLoading || seasons.isLoading || recentForm.isLoading;
  const hasError = profile.error || seasons.error || recentForm.error;
  const hasProfile = profile.profile != null;

  if (!hasBatter) {
    return (
      <ScreenLayout>
        <Text style={[styles.title, { color: theme.colors.text.primary, fontSize: theme.typography.h1.fontSize, marginBottom: theme.spacing.sm }]}>
          Batter Profile
        </Text>
        <Input
          label="Batter name"
          placeholder="e.g. V Kohli"
          value={query}
          onChangeText={setQuery}
          containerStyle={{ marginBottom: theme.spacing.md }}
        />
        {search.players.length > 0 && (
          <FlatList
            data={search.players}
            keyExtractor={(item) => item.name}
            style={{ maxHeight: 200 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.suggestionItem, { padding: theme.spacing.sm, borderBottomColor: theme.colors.divider }]}
                onPress={() => {
                  setQuery(item.name);
                  setSelectedBatter(item.name);
                }}
              >
                <Text style={{ color: theme.colors.text.primary }}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        <EmptyState message="Enter a batter name (min 2 characters) to see career stats, season breakdown, and recent form." />
      </ScreenLayout>
    );
  }

  if (profile.error && !hasProfile) {
    const handleRetry = () => {
      if (retryCount >= MAX_RETRIES) handleClear();
      else {
        profile.refetch();
        setRetryCount((c) => c + 1);
      }
    };
    return (
      <ScreenLayout>
        <ErrorState
          message={profile.error}
          onRetry={handleRetry}
          retryButtonLabel={retryCount >= MAX_RETRIES ? "Search again" : `Retry (${MAX_RETRIES - retryCount} of ${MAX_RETRIES} left)`}
        />
      </ScreenLayout>
    );
  }

  if (isLoading && !hasProfile) {
    return (
      <ScreenLayout>
        <Skeleton width="100%" height={40} style={{ marginBottom: theme.spacing.sm }} />
        <Skeleton width="100%" height={120} style={{ marginBottom: theme.spacing.sm }} />
        <Skeleton width="100%" height={80} />
      </ScreenLayout>
    );
  }

  if (!profile.profile) return null;

  const { batter, career, phase_performance, dismissals } = profile.profile;
  const recentMatches = recentForm.data?.recent_matches ?? [];
  const summary = recentForm.data?.summary;

  return (
    <ScreenLayout>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: theme.spacing.xxl }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { marginBottom: theme.spacing.lg }]}>
          <Text style={[styles.title, { color: theme.colors.text.primary, fontSize: theme.typography.h1.fontSize, marginBottom: theme.spacing.sm }]}>
            {batter}
          </Text>
          <View style={[styles.headerActions, { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm, marginTop: theme.spacing.xs }]}>
            <Button
              title="Compare vs bowlers"
              onPress={() => router.push({ pathname: "/compare-matchups", params: { batter: selectedBatter } })}
              variant="outline"
              style={styles.compareBtn}
            />
            <Button title="Search again" onPress={handleClear} variant="outline" />
          </View>
        </View>

        <Card style={[styles.card, { marginBottom: theme.spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, fontSize: theme.typography.h3.fontSize, marginBottom: theme.spacing.md }]}>
            Career Statistics
          </Text>
          <View style={[styles.statsGrid, { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm }]}>
            <StatCard label="Matches" value={career.matches} />
            <StatCard label="Runs" value={career.runs.toLocaleString()} accent />
            <StatCard label="Average" value={formatAverage(career.average)} />
            <StatCard label="Strike Rate" value={career.strike_rate.toFixed(2)} />
            <StatCard label="Highest" value={career.highest_score ?? "—"} />
          </View>
        </Card>

        {phase_performance && (phase_performance.powerplay || phase_performance.middle || phase_performance.death) && (
          <Card style={[styles.card, { marginBottom: theme.spacing.lg }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, fontSize: theme.typography.h3.fontSize, marginBottom: theme.spacing.md }]}>
              Phase Performance
            </Text>
            <View style={[styles.phaseRow, { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm }]}>
              {phase_performance.powerplay && (
                <View style={[styles.phaseItem, { flex: 1, minWidth: 90, padding: theme.spacing.md, borderRadius: theme.radius.sm, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
                  <Text style={[styles.phaseLabel, { color: theme.colors.text.secondary, fontSize: theme.typography.caption.fontSize, letterSpacing: 0.5 }]}>Powerplay</Text>
                  <Text style={[styles.phaseValue, { color: theme.colors.text.primary, fontWeight: "700", fontSize: theme.typography.h3.fontSize, marginTop: theme.spacing.xs }]}>{phase_performance.powerplay.runs} runs</Text>
                  <Text style={[styles.phaseSr, { color: theme.colors.text.secondary, fontSize: theme.typography.small.fontSize, marginTop: theme.spacing.xs }]}>
                    SR {phase_performance.powerplay.strike_rate.toFixed(1)}
                  </Text>
                </View>
              )}
              {phase_performance.middle && (
                <View style={[styles.phaseItem, { flex: 1, minWidth: 90, padding: theme.spacing.md, borderRadius: theme.radius.sm, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
                  <Text style={[styles.phaseLabel, { color: theme.colors.text.secondary, fontSize: theme.typography.caption.fontSize, letterSpacing: 0.5 }]}>Middle</Text>
                  <Text style={[styles.phaseValue, { color: theme.colors.text.primary, fontWeight: "700", fontSize: theme.typography.h3.fontSize, marginTop: theme.spacing.xs }]}>{phase_performance.middle.runs} runs</Text>
                  <Text style={[styles.phaseSr, { color: theme.colors.text.secondary, fontSize: theme.typography.small.fontSize, marginTop: theme.spacing.xs }]}>
                    SR {phase_performance.middle.strike_rate.toFixed(1)}
                  </Text>
                </View>
              )}
              {phase_performance.death && (
                <View style={[styles.phaseItem, { flex: 1, minWidth: 90, padding: theme.spacing.md, borderRadius: theme.radius.sm, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
                  <Text style={[styles.phaseLabel, { color: theme.colors.text.secondary, fontSize: theme.typography.caption.fontSize, letterSpacing: 0.5 }]}>Death</Text>
                  <Text style={[styles.phaseValue, { color: theme.colors.text.primary, fontWeight: "700", fontSize: theme.typography.h3.fontSize, marginTop: theme.spacing.xs }]}>{phase_performance.death.runs} runs</Text>
                  <Text style={[styles.phaseSr, { color: theme.colors.text.secondary, fontSize: theme.typography.small.fontSize, marginTop: theme.spacing.xs }]}>
                    SR {phase_performance.death.strike_rate.toFixed(1)}
                  </Text>
                </View>
              )}
            </View>
          </Card>
        )}

        <Card style={[styles.card, { marginBottom: theme.spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, fontSize: theme.typography.h3.fontSize, marginBottom: theme.spacing.md }]}>
            Dismissals
          </Text>
          <View style={[styles.dismissalsRow, { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm }]}>
            <Badge label={`Caught ${dismissals.caught}`} variant="secondary" />
            <Badge label={`Bowled ${dismissals.bowled}`} variant="primary" />
            <Badge label={`LBW ${dismissals.lbw}`} variant="warning" />
            <Badge label={`Stumped ${dismissals.stumped}`} variant="error" />
          </View>
        </Card>

        {(seasonList.length > 0 || (seasonFilter != null && seasons.data != null && !seasons.isLoading)) && (
          <Card style={[styles.card, { marginBottom: theme.spacing.lg }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, fontSize: theme.typography.h3.fontSize, marginBottom: theme.spacing.md }]}>
              By Season
            </Text>
            <View style={{ marginBottom: theme.spacing.md }}>
              <Select
                label="Filter by season"
                value={seasonFilter}
                options={[
                  { value: null, label: "All seasons" },
                  ...seasonList.map((s) => ({ value: s.season, label: s.season })),
                  ...(seasonFilter && !seasonList.some((s: SeasonProfile) => s.season === seasonFilter)
                    ? [{ value: seasonFilter, label: seasonFilter }]
                    : []),
                ]}
                onChange={setSeasonFilter}
                placeholder="All seasons"
              />
            </View>
            {seasonList.length === 0 && seasonFilter && !seasons.isLoading ? (
              <EmptyState message={`No data for ${seasonFilter}. Try "All seasons" or another year.`} />
            ) : (
              (seasonFilter ? seasonList.filter((s: SeasonProfile) => s.season === seasonFilter) : seasonList).map((s: SeasonProfile) => (
                <View
                  key={s.season}
                  style={[
                    styles.seasonRow,
                    {
                      paddingVertical: theme.spacing.md,
                      paddingHorizontal: theme.spacing.sm,
                      marginBottom: theme.spacing.sm,
                      borderRadius: theme.radius.sm,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.surface,
                    },
                  ]}
                >
                  <Text style={[styles.seasonName, { color: theme.colors.text.primary, fontWeight: "700", marginBottom: theme.spacing.sm, fontSize: theme.typography.h3.fontSize }]}>{s.season}</Text>
                  <View style={[styles.statsGrid, { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm }]}>
                    <StatCard label="Matches" value={s.matches} />
                    <StatCard label="Runs" value={s.runs} accent />
                    <StatCard label="Avg" value={formatAverage(s.average)} />
                    <StatCard label="SR" value={s.strike_rate.toFixed(1)} />
                  </View>
                </View>
              ))
            )}
          </Card>
        )}

        {recentMatches.length > 0 && (
          <Card style={[styles.card, { marginBottom: theme.spacing.lg }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, fontSize: theme.typography.h3.fontSize, marginBottom: theme.spacing.md }]}>
              Recent Form (Last 5)
            </Text>
            {summary && (
              <View style={[styles.summaryRow, { flexDirection: "row", gap: theme.spacing.md, marginBottom: theme.spacing.md }]}>
                <StatCard label="Runs" value={summary.runs} subtitle={`${summary.balls} balls`} />
                <StatCard label="Avg" value={formatAverage(summary.average)} />
                <StatCard label="SR" value={summary.strike_rate.toFixed(1)} />
              </View>
            )}
            {recentMatches.map((m: RecentMatch, index: number) => (
              <TouchableOpacity
                key={`${m.match_id}-${index}`}
                style={[
                  styles.matchRow,
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: theme.spacing.md,
                    paddingHorizontal: theme.spacing.sm,
                    marginBottom: theme.spacing.xs,
                    borderRadius: theme.radius.sm,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.surface,
                  },
                ]}
                onPress={() => router.push({ pathname: "/match-context", params: { match_id: String(m.match_id) } })}
                activeOpacity={0.7}
              >
                <View>
                  <Text style={[styles.matchRuns, { color: theme.colors.text.primary, fontWeight: "700", fontSize: theme.typography.body.fontSize }]}>{m.runs} runs ({m.balls} balls)</Text>
                  <Text style={[styles.matchMeta, { color: theme.colors.text.secondary, fontSize: theme.typography.small.fontSize, marginTop: theme.spacing.xs }]}>{m.venue} • {m.season}</Text>
                </View>
                <Badge label={m.dismissed ? "Out" : "Not Out"} variant={m.dismissed ? "error" : "success"} />
              </TouchableOpacity>
            ))}
          </Card>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {},
  header: {},
  title: { fontWeight: "bold" },
  headerActions: {},
  compareBtn: {},
  card: {},
  sectionTitle: { fontWeight: "600" },
  statsGrid: {},
  phaseRow: {},
  phaseItem: { alignItems: "center" },
  phaseLabel: { textTransform: "uppercase", fontWeight: "500" },
  phaseValue: {},
  phaseSr: {},
  dismissalsRow: {},
  seasonRow: {},
  seasonName: {},
  summaryRow: {},
  matchRow: {},
  matchRuns: {},
  matchMeta: {},
  suggestionItem: { borderBottomWidth: 1 },
});
