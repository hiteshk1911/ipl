import React, { useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ScreenLayout } from "../../../components/layout/ScreenLayout";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/layout/EmptyState";
import { Skeleton } from "../../../components/ui/Skeleton";
import { useThemeTokens } from "../../core/design-system/ThemeContext";
import { usePlayerSearch } from "../../domain/hooks/usePlayerSearch";
import { useMatchupsBatch } from "../../domain/hooks/useMatchupsBatch";
import { CompareMatchupCard } from "./CompareMatchupCard";

const MAX_BOWLERS = 5;
const MAX_RETRIES = 3;

interface CompareMatchupsScreenProps {
  initialBatter?: string | null;
}

export function CompareMatchupsScreen({ initialBatter }: CompareMatchupsScreenProps) {
  const theme = useThemeTokens();
  const [batterQuery, setBatterQuery] = useState(initialBatter ?? "");
  const [selectedBatter, setSelectedBatter] = useState(initialBatter?.trim() ?? "");
  const [bowlerQuery, setBowlerQuery] = useState("");
  const [bowlers, setBowlers] = useState<string[]>([]);
  const [retryCount, setRetryCount] = useState(0);

  const batterSearch = usePlayerSearch(batterQuery, true);
  const bowlerSearch = usePlayerSearch(bowlerQuery, true);
  const { data: matchupData, isLoading, errors, refetch } = useMatchupsBatch(selectedBatter, bowlers, !!selectedBatter && bowlers.length > 0);

  const handleClear = useCallback(() => {
    setBatterQuery("");
    setSelectedBatter("");
    setBowlerQuery("");
    setBowlers([]);
    setRetryCount(0);
  }, []);

  useEffect(() => {
    setRetryCount(0);
  }, [selectedBatter, bowlers.length]);

  const addBowler = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !bowlers.includes(trimmed) && bowlers.length < MAX_BOWLERS) {
      setBowlers([...bowlers, trimmed]);
      setBowlerQuery("");
    }
  };

  const removeBowler = (index: number) => {
    setBowlers(bowlers.filter((_, i) => i !== index));
  };

  const hasBatter = !!selectedBatter;
  const hasBowlers = bowlers.length > 0;
  const hasErrors = errors.some(Boolean);
  const handleRetry = () => {
    if (retryCount >= MAX_RETRIES) handleClear();
    else {
      refetch();
      setRetryCount((c) => c + 1);
    }
  };

  if (!hasBatter) {
    return (
      <ScreenLayout>
        <Text style={[styles.title, { color: theme.colors.text.primary, fontSize: theme.typography.h1.fontSize, marginBottom: theme.spacing.md }]}>
          Compare Matchups
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary, fontSize: theme.typography.body.fontSize, marginBottom: theme.spacing.lg }]}>
          Pick a batter, then add up to {MAX_BOWLERS} bowlers to compare head-to-head stats.
        </Text>
        <Input
          label="Batter"
          placeholder="e.g. V Kohli"
          value={batterQuery}
          onChangeText={setBatterQuery}
          containerStyle={{ marginBottom: theme.spacing.md }}
        />
        {batterSearch.players.length > 0 && (
          <View style={{ maxHeight: 180, marginBottom: theme.spacing.md }}>
            {batterSearch.players.map((item) => (
              <TouchableOpacity
                key={item.name}
                style={[styles.suggestionItem, { padding: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.divider, borderRadius: theme.radius.sm }]}
                onPress={() => {
                  setBatterQuery(item.name);
                  setSelectedBatter(item.name);
                }}
              >
                <Text style={{ color: theme.colors.text.primary, fontSize: theme.typography.body.fontSize }}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <EmptyState message="Enter a batter name (min 2 characters), then add bowlers to compare." />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: theme.spacing.xxl }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { marginBottom: theme.spacing.lg }]}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: theme.spacing.sm, marginBottom: theme.spacing.sm }}>
            <Text style={[styles.title, { color: theme.colors.text.primary, fontSize: theme.typography.h1.fontSize }]}>
              Compare Matchups
            </Text>
            <Button title="Search again" onPress={handleClear} variant="outline" />
          </View>
          <Text style={[styles.batterLabel, { color: theme.colors.text.secondary, fontSize: theme.typography.body.fontSize, marginBottom: theme.spacing.md }]}>
            Batter: {selectedBatter}
          </Text>

          <Input
            label="Add bowler"
            placeholder="e.g. Jasprit Bumrah"
            value={bowlerQuery}
            onChangeText={setBowlerQuery}
            containerStyle={{ marginBottom: theme.spacing.sm }}
          />
          {bowlerSearch.players.length > 0 && (
            <View style={{ maxHeight: 150, marginBottom: theme.spacing.md }}>
              {bowlerSearch.players.map((item) => (
                <TouchableOpacity
                  key={item.name}
                  style={[styles.suggestionItem, { padding: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.divider, borderRadius: theme.radius.sm }]}
                  onPress={() => addBowler(item.name)}
                >
                  <Text style={{ color: theme.colors.text.primary, fontSize: theme.typography.body.fontSize }}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {bowlers.length > 0 && (
            <View style={[styles.bowlerList, { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm, marginBottom: theme.spacing.md }]}>
              {bowlers.map((b, index) => (
                <View
                  key={`${b}-${index}`}
                  style={[
                    styles.bowlerChip,
                    {
                      backgroundColor: theme.colors.surface,
                      paddingHorizontal: theme.spacing.md,
                      paddingVertical: theme.spacing.sm,
                      borderRadius: theme.radius.md,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: theme.spacing.xs,
                    },
                  ]}
                >
                  <Text style={{ color: theme.colors.text.primary, fontSize: theme.typography.body.fontSize, fontWeight: "600" }}>{b}</Text>
                  <TouchableOpacity onPress={() => removeBowler(index)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Text style={{ color: theme.colors.error, fontSize: theme.typography.body.fontSize, fontWeight: "700" }}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {isLoading && (
          <View style={{ marginBottom: theme.spacing.lg }}>
            <Skeleton width="100%" height={100} style={{ marginBottom: theme.spacing.sm }} />
            <Skeleton width="100%" height={100} />
          </View>
        )}

        {hasErrors && hasBowlers && !isLoading && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: theme.spacing.sm,
              marginBottom: theme.spacing.md,
              padding: theme.spacing.md,
              borderRadius: theme.radius.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surface,
            }}
          >
            <Text style={{ color: theme.colors.text.secondary, fontSize: theme.typography.body.fontSize, flex: 1 }}>
              Some matchups could not be loaded.
            </Text>
            <Button
              title={retryCount >= MAX_RETRIES ? "Search again" : `Retry (${MAX_RETRIES - retryCount} of ${MAX_RETRIES} left)`}
              onPress={handleRetry}
              variant="outline"
            />
          </View>
        )}

        {!isLoading && hasBowlers && matchupData.length > 0 && (
          <View style={[styles.cards, { gap: theme.spacing.md }]}>
            {bowlers.map((bowler, index) => (
              <CompareMatchupCard
                key={`${bowler}-${index}`}
                bowlerName={bowler}
                data={matchupData[index] ?? null}
                error={errors[index] ?? null}
              />
            ))}
          </View>
        )}

        {!isLoading && hasBatter && !hasBowlers && (
          <EmptyState message="Add at least one bowler above to compare matchup stats." />
        )}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {},
  header: {},
  title: { fontWeight: "bold" },
  subtitle: {},
  batterLabel: {},
  suggestionItem: { borderBottomWidth: 1 },
  bowlerList: {},
  bowlerChip: {},
  cards: {},
});
