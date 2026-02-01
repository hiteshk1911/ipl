import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { useThemeTokens } from "../../core/design-system/ThemeContext";
import type { PlayerResponse } from "../../data/types";

interface SearchFormProps {
  batterQuery: string;
  bowlerQuery: string;
  onBatterChange: (v: string) => void;
  onBowlerChange: (v: string) => void;
  batterSuggestions: PlayerResponse[];
  bowlerSuggestions: PlayerResponse[];
  onSelectBatter: (name: string) => void;
  onSelectBowler: (name: string) => void;
  onAnalyze: () => void;
  onClear?: () => void;
  isLoading?: boolean;
}

export function SearchForm({
  batterQuery,
  bowlerQuery,
  onBatterChange,
  onBowlerChange,
  batterSuggestions,
  bowlerSuggestions,
  onSelectBatter,
  onSelectBowler,
  onAnalyze,
  onClear,
  isLoading = false,
}: SearchFormProps) {
  const theme = useThemeTokens();
  const { colors, spacing, typography } = theme;
  const [batterFocused, setBatterFocused] = useState(false);
  const [bowlerFocused, setBowlerFocused] = useState(false);

  const showBatterList = batterFocused && batterSuggestions.length > 0;
  const showBowlerList = bowlerFocused && bowlerSuggestions.length > 0;

  return (
    <View style={[styles.container, { marginBottom: spacing.lg }]}>
      <Text style={[styles.title, { color: colors.text.primary, fontSize: typography.h1.fontSize, marginBottom: spacing.xs }]}>
        Matchup Analysis
      </Text>
      <Text style={[styles.subtitle, { color: colors.text.secondary, fontSize: typography.body.fontSize, marginBottom: spacing.lg }]}>
        Search batter vs bowler stats
      </Text>

      <View style={[styles.inputRow, { marginBottom: spacing.sm }]}>
        <View style={styles.inputWrap}>
          <Input
            label="Batter"
            placeholder="e.g. V Kohli"
            value={batterQuery}
            onChangeText={onBatterChange}
            onFocus={() => setBatterFocused(true)}
            onBlur={() => setTimeout(() => setBatterFocused(false), 200)}
            containerStyle={styles.input}
          />
          {showBatterList && (
            <View style={[styles.suggestions, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: theme.radius.md }]}>
              <FlatList
                data={batterSuggestions}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.suggestionItem, { padding: spacing.sm, borderBottomColor: colors.divider }]}
                    onPress={() => {
                      onSelectBatter(item.name);
                      setBatterFocused(false);
                    }}
                  >
                    <Text style={{ color: colors.text.primary, fontSize: typography.body.fontSize }}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                style={styles.suggestionsList}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          )}
        </View>
      </View>

      <View style={[styles.inputRow, { marginBottom: spacing.md }]}>
        <View style={styles.inputWrap}>
          <Input
            label="Bowler"
            placeholder="e.g. Jasprit Bumrah"
            value={bowlerQuery}
            onChangeText={onBowlerChange}
            onFocus={() => setBowlerFocused(true)}
            onBlur={() => setTimeout(() => setBowlerFocused(false), 200)}
            containerStyle={styles.input}
          />
          {showBowlerList && (
            <View style={[styles.suggestions, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: theme.radius.md }]}>
              <FlatList
                data={bowlerSuggestions}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.suggestionItem, { padding: spacing.sm, borderBottomColor: colors.divider }]}
                    onPress={() => {
                      onSelectBowler(item.name);
                      setBowlerFocused(false);
                    }}
                  >
                    <Text style={{ color: colors.text.primary, fontSize: typography.body.fontSize }}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                style={styles.suggestionsList}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          )}
        </View>
      </View>

      <View style={[styles.buttonRow, { flexDirection: "row", gap: spacing.sm, marginTop: spacing.xs }]}>
        {onClear && (batterQuery.trim() || bowlerQuery.trim()) ? (
          <Button title="Clear" onPress={onClear} variant="outline" style={styles.clearButton} />
        ) : null}
        <Button title={isLoading ? "Loading…" : "Analyze"} onPress={onAnalyze} disabled={!batterQuery.trim() || !bowlerQuery.trim() || isLoading} style={styles.analyzeButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {
    fontWeight: "bold",
  },
  subtitle: {},
  inputRow: {},
  buttonRow: {},
  clearButton: { flex: 0 },
  analyzeButton: { flex: 1 },
  inputWrap: {
    width: "100%",
    position: "relative",
  },
  input: {},
  suggestions: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "100%",
    borderWidth: 1,
    maxHeight: 200,
    zIndex: 10,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    borderBottomWidth: 1,
  },
});
