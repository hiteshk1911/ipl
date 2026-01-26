import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Colors } from "../constants/colors";
import { Spacing } from "../constants/spacing";
import { Card } from "../components/ui/Card";
import { StatCard } from "../components/ui/StatCard";
import { Badge } from "../components/ui/Badge";

export default function BatterProfileScreen() {
  // Dummy data
  const batterProfile = {
    name: "Virat Kohli",
    team: "Royal Challengers Bangalore",
    role: "Batsman",
    battingStyle: "Right Handed",
    stats: {
      matches: 237,
      runs: 7263,
      average: 37.25,
      strikeRate: 130.02,
      centuries: 8,
      halfCenturies: 50,
      highestScore: 113,
    },
    seasonStats: {
      matches: 15,
      runs: 639,
      average: 53.25,
      strikeRate: 139.82,
      fours: 65,
      sixes: 28,
    },
    strengths: ["Cover Drive", "Pull Shot", "Running Between Wickets"],
    weaknesses: ["Early Swing", "Short Ball"],
    recentInnings: [
      { runs: 92, balls: 59, opponent: "CSK", result: "Won", date: "2024-04-15" },
      { runs: 45, balls: 32, opponent: "MI", result: "Lost", date: "2024-04-12" },
      { runs: 78, balls: 56, opponent: "KKR", result: "Won", date: "2024-04-10" },
      { runs: 34, balls: 28, opponent: "DC", result: "Lost", date: "2024-04-08" },
      { runs: 101, balls: 68, opponent: "RR", result: "Won", date: "2024-04-05" },
    ],
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{batterProfile.name}</Text>
        <Text style={styles.subtitle}>{batterProfile.team}</Text>
        <View style={styles.badges}>
          <Badge label={batterProfile.role} variant="primary" />
          <Badge label={batterProfile.battingStyle} variant="secondary" />
        </View>
      </View>

      <Card style={styles.overviewCard}>
        <Text style={styles.sectionTitle}>Career Statistics</Text>
        <View style={styles.statsGrid}>
          <StatCard label="Matches" value={batterProfile.stats.matches} />
          <StatCard label="Runs" value={batterProfile.stats.runs.toLocaleString()} />
          <StatCard label="Average" value={batterProfile.stats.average.toFixed(2)} />
          <StatCard label="Strike Rate" value={batterProfile.stats.strikeRate.toFixed(2)} />
          <StatCard label="100s" value={batterProfile.stats.centuries} />
          <StatCard label="50s" value={batterProfile.stats.halfCenturies} />
        </View>
      </Card>

      <Card style={styles.seasonCard}>
        <Text style={styles.sectionTitle}>Current Season</Text>
        <View style={styles.statsGrid}>
          <StatCard label="Matches" value={batterProfile.seasonStats.matches} />
          <StatCard label="Runs" value={batterProfile.seasonStats.runs} />
          <StatCard label="Average" value={batterProfile.seasonStats.average.toFixed(2)} />
          <StatCard label="Strike Rate" value={batterProfile.seasonStats.strikeRate.toFixed(2)} />
          <StatCard label="4s" value={batterProfile.seasonStats.fours} />
          <StatCard label="6s" value={batterProfile.seasonStats.sixes} />
        </View>
      </Card>

      <View style={styles.analysisRow}>
        <Card style={styles.strengthCard}>
          <Text style={styles.sectionTitle}>Strengths</Text>
          {batterProfile.strengths.map((strength, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{strength}</Text>
            </View>
          ))}
        </Card>

        <Card style={styles.weaknessCard}>
          <Text style={styles.sectionTitle}>Weaknesses</Text>
          {batterProfile.weaknesses.map((weakness, index) => (
            <View key={index} style={[styles.tag, styles.weaknessTag]}>
              <Text style={styles.tagText}>{weakness}</Text>
            </View>
          ))}
        </Card>
      </View>

      <Card style={styles.recentCard}>
        <Text style={styles.sectionTitle}>Recent Innings</Text>
        {batterProfile.recentInnings.map((inning, index) => (
          <View key={index} style={styles.inningRow}>
            <View style={styles.inningInfo}>
              <Text style={styles.inningRuns}>{inning.runs} runs</Text>
              <Text style={styles.inningDetails}>
                {inning.balls} balls • vs {inning.opponent} • {inning.date}
              </Text>
            </View>
            <Badge
              label={inning.result}
              variant={inning.result === "Won" ? "success" : "error"}
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
    marginBottom: Spacing.sm,
  },
  badges: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  overviewCard: {
    marginBottom: Spacing.lg,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  seasonCard: {
    marginBottom: Spacing.lg,
  },
  analysisRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  strengthCard: {
    flex: 1,
  },
  weaknessCard: {
    flex: 1,
  },
  tag: {
    backgroundColor: Colors.secondary + "20",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 4,
    marginBottom: Spacing.xs,
  },
  weaknessTag: {
    backgroundColor: Colors.error + "20",
  },
  tagText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  recentCard: {
    marginBottom: Spacing.lg,
  },
  inningRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  inningInfo: {
    flex: 1,
  },
  inningRuns: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  inningDetails: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
});
