import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Colors } from "../constants/colors";
import { Spacing } from "../constants/spacing";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

export default function DetailedInsightsScreen() {
  // Dummy data
  const insights = {
    keyInsights: [
      {
        title: "Powerplay Dominance",
        description: "Batter has scored 45% of runs in powerplay overs with a strike rate of 180+",
        impact: "High",
        category: "Batting",
      },
      {
        title: "Weakness Against Spin",
        description: "Dismissed 8 times by spinners in last 15 matches, average drops to 28.5",
        impact: "Critical",
        category: "Batting",
      },
      {
        title: "Death Over Specialist",
        description: "Maintains 190+ strike rate in final 4 overs, ideal for finishing",
        impact: "High",
        category: "Batting",
      },
    ],
    pitchAnalysis: {
      venue: "M. Chinnaswamy Stadium, Bangalore",
      pitchType: "Batting Friendly",
      averageScore: 185,
      recommendation: "High scoring match expected, favor aggressive batting",
    },
    bowlerMatchups: [
      {
        bowler: "Jasprit Bumrah",
        runs: 156,
        balls: 89,
        dismissals: 3,
        strikeRate: 175.3,
        advantage: "Batter",
      },
      {
        bowler: "Ravindra Jadeja",
        runs: 89,
        balls: 112,
        dismissals: 5,
        strikeRate: 79.5,
        advantage: "Bowler",
      },
      {
        bowler: "Mohammed Shami",
        runs: 234,
        balls: 145,
        dismissals: 2,
        strikeRate: 161.4,
        advantage: "Batter",
      },
    ],
    phaseBreakdown: {
      overs1to6: { runs: 45, strikeRate: 180, risk: "Low" },
      overs7to15: { runs: 78, strikeRate: 165, risk: "Medium" },
      overs16to20: { runs: 33, strikeRate: 190, risk: "High" },
    },
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return Colors.secondary;
      case "Critical":
        return Colors.error;
      default:
        return Colors.warning;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Detailed Insights</Text>
        <Text style={styles.subtitle}>Advanced analytics and recommendations</Text>
      </View>

      <Card style={styles.insightsCard}>
        <Text style={styles.sectionTitle}>Key Insights</Text>
        {insights.keyInsights.map((insight, index) => (
          <View key={index} style={styles.insightItem}>
            <View style={styles.insightHeader}>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Badge
                label={insight.impact}
                variant={insight.impact === "Critical" ? "error" : insight.impact === "High" ? "success" : "warning"}
              />
            </View>
            <Text style={styles.insightDescription}>{insight.description}</Text>
            <Text style={styles.insightCategory}>{insight.category}</Text>
          </View>
        ))}
      </Card>

      <Card style={styles.pitchCard}>
        <Text style={styles.sectionTitle}>Pitch Analysis</Text>
        <View style={styles.pitchInfo}>
          <Text style={styles.venue}>{insights.pitchAnalysis.venue}</Text>
          <View style={styles.pitchDetails}>
            <View style={styles.pitchRow}>
              <Text style={styles.pitchLabel}>Pitch Type:</Text>
              <Badge label={insights.pitchAnalysis.pitchType} variant="success" />
            </View>
            <View style={styles.pitchRow}>
              <Text style={styles.pitchLabel}>Average Score:</Text>
              <Text style={styles.pitchValue}>{insights.pitchAnalysis.averageScore}</Text>
            </View>
            <Text style={styles.recommendation}>{insights.pitchAnalysis.recommendation}</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.matchupCard}>
        <Text style={styles.sectionTitle}>Bowler Matchups</Text>
        {insights.bowlerMatchups.map((matchup, index) => (
          <View key={index} style={styles.matchupItem}>
            <View style={styles.matchupHeader}>
              <Text style={styles.bowlerName}>{matchup.bowler}</Text>
              <Badge
                label={matchup.advantage}
                variant={matchup.advantage === "Batter" ? "success" : "error"}
              />
            </View>
            <View style={styles.matchupStats}>
              <Text style={styles.matchupStat}>{matchup.runs} runs</Text>
              <Text style={styles.matchupStat}>{matchup.balls} balls</Text>
              <Text style={styles.matchupStat}>SR: {matchup.strikeRate.toFixed(1)}</Text>
              <Text style={styles.matchupStat}>{matchup.dismissals} dismissals</Text>
            </View>
          </View>
        ))}
      </Card>

      <Card style={styles.phaseCard}>
        <Text style={styles.sectionTitle}>Phase Breakdown</Text>
        <View style={styles.phaseContainer}>
          <View style={styles.phaseItem}>
            <Text style={styles.phaseLabel}>Overs 1-6</Text>
            <Text style={styles.phaseRuns}>{insights.phaseBreakdown.overs1to6.runs} runs</Text>
            <Text style={styles.phaseSR}>SR: {insights.phaseBreakdown.overs1to6.strikeRate}</Text>
            <Badge label={insights.phaseBreakdown.overs1to6.risk} variant="success" />
          </View>
          <View style={styles.phaseItem}>
            <Text style={styles.phaseLabel}>Overs 7-15</Text>
            <Text style={styles.phaseRuns}>{insights.phaseBreakdown.overs7to15.runs} runs</Text>
            <Text style={styles.phaseSR}>SR: {insights.phaseBreakdown.overs7to15.strikeRate}</Text>
            <Badge label={insights.phaseBreakdown.overs7to15.risk} variant="warning" />
          </View>
          <View style={styles.phaseItem}>
            <Text style={styles.phaseLabel}>Overs 16-20</Text>
            <Text style={styles.phaseRuns}>{insights.phaseBreakdown.overs16to20.runs} runs</Text>
            <Text style={styles.phaseSR}>SR: {insights.phaseBreakdown.overs16to20.strikeRate}</Text>
            <Badge label={insights.phaseBreakdown.overs16to20.risk} variant="error" />
          </View>
        </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  insightsCard: {
    marginBottom: Spacing.lg,
  },
  insightItem: {
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  insightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    flex: 1,
  },
  insightDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  insightCategory: {
    fontSize: 12,
    color: Colors.primary,
    textTransform: "uppercase",
  },
  pitchCard: {
    marginBottom: Spacing.lg,
  },
  pitchInfo: {
    marginTop: Spacing.sm,
  },
  venue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  pitchDetails: {
    gap: Spacing.sm,
  },
  pitchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  pitchLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  pitchValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  recommendation: {
    fontSize: 14,
    color: Colors.text.primary,
    fontStyle: "italic",
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.warning + "20",
    borderRadius: 4,
  },
  matchupCard: {
    marginBottom: Spacing.lg,
  },
  matchupItem: {
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  matchupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  bowlerName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  matchupStats: {
    flexDirection: "row",
    gap: Spacing.md,
    flexWrap: "wrap",
  },
  matchupStat: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  phaseCard: {
    marginBottom: Spacing.lg,
  },
  phaseContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: Spacing.sm,
  },
  phaseItem: {
    alignItems: "center",
    flex: 1,
  },
  phaseLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
  },
  phaseRuns: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  phaseSR: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
});
