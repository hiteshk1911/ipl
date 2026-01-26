import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Colors } from "../constants/colors";
import { Spacing } from "../constants/spacing";
import { Card } from "../components/ui/Card";
import { StatCard } from "../components/ui/StatCard";
import { Badge } from "../components/ui/Badge";

export default function MatchupAnalysisScreen() {
  // Dummy data
  const matchupData = {
    batter: "Virat Kohli",
    bowler: "Jasprit Bumrah",
    confidence: 72,
    headToHead: {
      runs: 156,
      balls: 89,
      dismissals: 3,
      strikeRate: 175.3,
    },
    recentForm: {
      last5Matches: [
        { runs: 45, balls: 32, dismissed: false },
        { runs: 67, balls: 44, dismissed: true },
        { runs: 23, balls: 18, dismissed: false },
        { runs: 89, balls: 56, dismissed: false },
        { runs: 34, balls: 28, dismissed: true },
      ],
    },
    phaseAnalysis: {
      powerplay: { runs: 45, strikeRate: 180 },
      middle: { runs: 78, strikeRate: 165 },
      death: { runs: 33, strikeRate: 190 },
    },
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Matchup Analysis</Text>
        <Text style={styles.subtitle}>
          {matchupData.batter} vs {matchupData.bowler}
        </Text>
      </View>

      <View style={styles.confidenceSection}>
        <Text style={styles.sectionTitle}>Confidence Score</Text>
        <View style={styles.confidenceBadge}>
          <Text style={styles.confidenceValue}>{matchupData.confidence}%</Text>
          <Badge
            label={matchupData.confidence > 70 ? "High" : matchupData.confidence > 50 ? "Medium" : "Low"}
            variant={matchupData.confidence > 70 ? "success" : matchupData.confidence > 50 ? "warning" : "error"}
          />
        </View>
      </View>

      <View style={styles.statsGrid}>
        <StatCard label="Total Runs" value={matchupData.headToHead.runs} subtitle={`${matchupData.headToHead.balls} balls`} />
        <StatCard label="Strike Rate" value={matchupData.headToHead.strikeRate.toFixed(1)} subtitle="Overall" />
        <StatCard label="Dismissals" value={matchupData.headToHead.dismissals} subtitle="Times out" />
      </View>

      <Card style={styles.phaseCard}>
        <Text style={styles.sectionTitle}>Phase-wise Performance</Text>
        <View style={styles.phaseRow}>
          <View style={styles.phaseItem}>
            <Text style={styles.phaseLabel}>Powerplay</Text>
            <Text style={styles.phaseValue}>{matchupData.phaseAnalysis.powerplay.runs} runs</Text>
            <Text style={styles.phaseSR}>SR: {matchupData.phaseAnalysis.powerplay.strikeRate}</Text>
          </View>
          <View style={styles.phaseItem}>
            <Text style={styles.phaseLabel}>Middle</Text>
            <Text style={styles.phaseValue}>{matchupData.phaseAnalysis.middle.runs} runs</Text>
            <Text style={styles.phaseSR}>SR: {matchupData.phaseAnalysis.middle.strikeRate}</Text>
          </View>
          <View style={styles.phaseItem}>
            <Text style={styles.phaseLabel}>Death</Text>
            <Text style={styles.phaseValue}>{matchupData.phaseAnalysis.death.runs} runs</Text>
            <Text style={styles.phaseSR}>SR: {matchupData.phaseAnalysis.death.strikeRate}</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.recentCard}>
        <Text style={styles.sectionTitle}>Recent Form (Last 5)</Text>
        {matchupData.recentForm.last5Matches.map((match, index) => (
          <View key={index} style={styles.matchRow}>
            <View style={styles.matchInfo}>
              <Text style={styles.matchRuns}>{match.runs} runs</Text>
              <Text style={styles.matchBalls}>{match.balls} balls</Text>
            </View>
            <Badge
              label={match.dismissed ? "Out" : "Not Out"}
              variant={match.dismissed ? "error" : "success"}
            />
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  confidenceSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  confidenceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  confidenceValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.primary,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  phaseCard: {
    marginBottom: Spacing.lg,
  },
  phaseRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: Spacing.md,
  },
  phaseItem: {
    alignItems: "center",
  },
  phaseLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
  },
  phaseValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  phaseSR: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  recentCard: {
    marginBottom: Spacing.lg,
  },
  matchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  matchInfo: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  matchRuns: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  matchBalls: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});
