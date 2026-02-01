import React, { useState, useCallback, useEffect } from "react";
import { View } from "react-native";
import { ScreenLayout } from "../../../components/layout/ScreenLayout";
import { EmptyState } from "../../../components/layout/EmptyState";
import { ErrorState } from "../../../components/layout/ErrorState";
import { Skeleton } from "../../../components/ui/Skeleton";
import { useThemeTokens } from "../../core/design-system/ThemeContext";
import { usePlayerSearch } from "../../domain/hooks/usePlayerSearch";
import { useMatchup } from "../../domain/hooks/useMatchup";
import { useAvailableSeasons } from "../../domain/hooks/useAvailableSeasons";
import { SearchForm } from "./SearchForm";
import { MatchupResult } from "./MatchupResult";
import { Select } from "../../../components/ui/Select";

const MAX_RETRIES = 3;

export function MatchupSearchScreen() {
  const theme = useThemeTokens();
  const [batterQuery, setBatterQuery] = useState("");
  const [bowlerQuery, setBowlerQuery] = useState("");
  const [selectedBatter, setSelectedBatter] = useState("");
  const [selectedBowler, setSelectedBowler] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [seasonFilter, setSeasonFilter] = useState<string | null>(null);

  const availableSeasons = useAvailableSeasons(true);
  const batterSearch = usePlayerSearch(batterQuery, true);
  const bowlerSearch = usePlayerSearch(bowlerQuery, true);
  const matchup = useMatchup(selectedBatter, selectedBowler, submitted && !!selectedBatter && !!selectedBowler, seasonFilter);

  useEffect(() => {
    if (seasonFilter != null && availableSeasons.seasons.length > 0 && !availableSeasons.seasons.includes(seasonFilter)) {
      setSeasonFilter(null);
    }
  }, [seasonFilter, availableSeasons.seasons]);

  const handleClear = useCallback(() => {
    setBatterQuery("");
    setBowlerQuery("");
    setSelectedBatter("");
    setSelectedBowler("");
    setSubmitted(false);
    setRetryCount(0);
    setSeasonFilter(null);
  }, []);

  const handleAnalyze = useCallback(() => {
    setSelectedBatter(batterQuery.trim());
    setSelectedBowler(bowlerQuery.trim());
    setSubmitted(true);
    setRetryCount(0);
  }, [batterQuery, bowlerQuery]);

  const handleRetry = useCallback(() => {
    if (retryCount >= MAX_RETRIES) {
      handleClear();
    } else {
      matchup.refetch();
      setRetryCount((c) => c + 1);
    }
  }, [retryCount, handleClear, matchup]);

  const hasSearched = submitted && !!selectedBatter && !!selectedBowler;
  const showEmpty = !hasSearched;
  const showLoading = matchup.isLoading;
  const showError = hasSearched && matchup.error && !matchup.isLoading;
  const showResult = hasSearched && matchup.data && !matchup.isLoading;

  return (
    <ScreenLayout>
      <SearchForm
        batterQuery={batterQuery}
        bowlerQuery={bowlerQuery}
        onBatterChange={(v) => {
          setBatterQuery(v);
          setSelectedBatter(v);
        }}
        onBowlerChange={(v) => {
          setBowlerQuery(v);
          setSelectedBowler(v);
        }}
        batterSuggestions={batterSearch.players}
        bowlerSuggestions={bowlerSearch.players}
        onSelectBatter={(name) => {
          setBatterQuery(name);
          setSelectedBatter(name);
        }}
        onSelectBowler={(name) => {
          setBowlerQuery(name);
          setSelectedBowler(name);
        }}
        onAnalyze={handleAnalyze}
        onClear={handleClear}
        isLoading={matchup.isLoading}
      />

      {hasSearched && (
        <View style={{ marginTop: theme.spacing.sm, marginBottom: theme.spacing.sm }}>
          <Select
            label="Filter by season"
            value={seasonFilter}
            options={[
              { value: null, label: "All seasons" },
              ...availableSeasons.seasons.map((y) => ({ value: y, label: y })),
            ]}
            onChange={setSeasonFilter}
            placeholder="All seasons"
          />
        </View>
      )}

      {showLoading && (
        <View style={{ marginTop: theme.spacing.lg }}>
          <Skeleton width="100%" height={120} style={{ marginBottom: theme.spacing.sm }} />
          <Skeleton width="100%" height={80} style={{ marginBottom: theme.spacing.sm }} />
          <Skeleton width="100%" height={200} />
        </View>
      )}

      {showError && (
        <ErrorState
          message={
            seasonFilter && matchup.errorCode === "NOT_FOUND"
              ? `No matchup data for ${seasonFilter}. Try "All seasons" or another year.`
              : (matchup.error ?? "Something went wrong")
          }
          onRetry={handleRetry}
          retryButtonLabel={retryCount >= MAX_RETRIES ? "Reset search" : `Retry (${MAX_RETRIES - retryCount} of ${MAX_RETRIES} left)`}
        />
      )}

      {showResult && matchup.data && <MatchupResult data={matchup.data} />}

      {showEmpty && !showLoading && !showError && (
        <EmptyState
          message="Select a batter and bowler, then tap Analyze to see head-to-head stats."
          ctaLabel="Try search above"
          onCtaPress={() => {}}
        />
      )}
    </ScreenLayout>
  );
}
