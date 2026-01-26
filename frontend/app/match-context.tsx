import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Colors } from "../constants/colors";
import { Spacing } from "../constants/spacing";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

export default function MatchContextScreen() {
  // Dummy data
  const matchContext = {
    match: {
      teams: "RCB vs CSK",
      date: "April 20, 2024",
      venue: "M. Chinnaswamy Stadium, Bangalore",
      time: "7:30 PM IST",
    },
    conditions: {
      weather: "Clear",
      temperature: "32°C",
      humidity: "65%",
      windSpeed: "12 km/h",
      pitchCondition: "Dry",
      dewFactor: "Moderate",
    },
    toss: {
      wonBy: "CSK",
      decision: "Field First",
      reason: "Dew factor expected in second innings",
    },
    teamComposition: {
      rcb: {
        batters: 6,
        allRounders: 2,
        bowlers: 4,
        keyPlayers: ["Virat Kohli", "Faf du Plessis", "Glenn Maxwell"],
      },
      csk: {
        batters: 5,
        allRounders: 3,
        bowlers: 4,
        keyPlayers: ["MS Dhoni", "Ruturaj Gaikwad", "Ravindra Jadeja"],
      },
    },
    historicalData: {
      headToHead: {
        totalMatches: 32,
        rcbWins: 10,
        cskWins: 20,
        noResult: 2,
      },
      venueStats: {
        averageFirstInnings: 185,
        averageSecondInnings: 172,
        highestTotal: 263,
        lowestTotal: 49,
      },
    },
    keyFactors: [
      "High scoring venue with small boundaries",
      "Dew factor favors chasing team",
      "RCB strong batting lineup at home",
      "CSK's spin attack could be crucial",
    ],
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Match Context</Text>
        <Text style={styles.subtitle}>{matchContext.match.teams}</Text>
      </View>

      <Card style={styles.matchCard}>
        <Text style={styles.sectionTitle}>Match Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date:</Text>
          <Text style={styles.infoValue}>{matchContext.match.date}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Time:</Text>
          <Text style={styles.infoValue}>{matchContext.match.time}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Venue:</Text>
          <Text style={styles.infoValue}>{matchContext.match.venue}</Text>
        </View>
      </Card>

      <Card style={styles.conditionsCard}>
        <Text style={styles.sectionTitle}>Weather & Conditions</Text>
        <View style={styles.conditionsGrid}>
          <View style={styles.conditionItem}>
            <Text style={styles.conditionLabel}>Weather</Text>
            <Badge label={matchContext.conditions.weather} variant="success" />
          </View>
          <View style={styles.conditionItem}>
            <Text style={styles.conditionLabel}>Temperature</Text>
            <Text style={styles.conditionValue}>{matchContext.conditions.temperature}</Text>
          </View>
          <View style={styles.conditionItem}>
            <Text style={styles.conditionLabel}>Humidity</Text>
            <Text style={styles.conditionValue}>{matchContext.conditions.humidity}</Text>
          </View>
          <View style={styles.conditionItem}>
            <Text style={styles.conditionLabel}>Wind</Text>
            <Text style={styles.conditionValue}>{matchContext.conditions.windSpeed}</Text>
          </View>
          <View style={styles.conditionItem}>
            <Text style={styles.conditionLabel}>Pitch</Text>
            <Badge label={matchContext.conditions.pitchCondition} variant="warning" />
          </View>
          <View style={styles.conditionItem}>
            <Text style={styles.conditionLabel}>Dew</Text>
            <Badge label={matchContext.conditions.dewFactor} variant="secondary" />
          </View>
        </View>
      </Card>

      <Card style={styles.tossCard}>
        <Text style={styles.sectionTitle}>Toss</Text>
        <View style={styles.tossInfo}>
          <View style={styles.tossRow}>
            <Text style={styles.tossLabel}>Won By:</Text>
            <Badge label={matchContext.toss.wonBy} variant="primary" />
          </View>
          <View style={styles.tossRow}>
            <Text style={styles.tossLabel}>Decision:</Text>
            <Text style={styles.tossValue}>{matchContext.toss.decision}</Text>
          </View>
          <Text style={styles.tossReason}>{matchContext.toss.reason}</Text>
        </View>
      </Card>

      <View style={styles.teamsRow}>
        <Card style={styles.teamCard}>
          <Text style={styles.teamName}>RCB</Text>
          <View style={styles.teamComposition}>
            <Text style={styles.compositionText}>Batters: {matchContext.teamComposition.rcb.batters}</Text>
            <Text style={styles.compositionText}>All-rounders: {matchContext.teamComposition.rcb.allRounders}</Text>
            <Text style={styles.compositionText}>Bowlers: {matchContext.teamComposition.rcb.bowlers}</Text>
          </View>
          <Text style={styles.keyPlayersLabel}>Key Players:</Text>
          <View style={styles.playersList}>
            {matchContext.teamComposition.rcb.keyPlayers.map((player, index) => (
              <Badge key={index} label={player} variant="primary" />
            ))}
          </View>
        </Card>

        <Card style={styles.teamCard}>
          <Text style={styles.teamName}>CSK</Text>
          <View style={styles.teamComposition}>
            <Text style={styles.compositionText}>Batters: {matchContext.teamComposition.csk.batters}</Text>
            <Text style={styles.compositionText}>All-rounders: {matchContext.teamComposition.csk.allRounders}</Text>
            <Text style={styles.compositionText}>Bowlers: {matchContext.teamComposition.csk.bowlers}</Text>
          </View>
          <Text style={styles.keyPlayersLabel}>Key Players:</Text>
          <View style={styles.playersList}>
            {matchContext.teamComposition.csk.keyPlayers.map((player, index) => (
              <Badge key={index} label={player} variant="secondary" />
            ))}
          </View>
        </Card>
      </View>

      <Card style={styles.historicalCard}>
        <Text style={styles.sectionTitle}>Historical Data</Text>
        <View style={styles.historicalSection}>
          <Text style={styles.historicalLabel}>Head to Head</Text>
          <View style={styles.h2hStats}>
            <View style={styles.h2hItem}>
              <Text style={styles.h2hTeam}>RCB</Text>
              <Text style={styles.h2hWins}>{matchContext.historicalData.headToHead.rcbWins} wins</Text>
            </View>
            <View style={styles.h2hItem}>
              <Text style={styles.h2hTeam}>CSK</Text>
              <Text style={styles.h2hWins}>{matchContext.historicalData.headToHead.cskWins} wins</Text>
            </View>
          </View>
        </View>
        <View style={styles.venueSection}>
          <Text style={styles.historicalLabel}>Venue Stats</Text>
          <View style={styles.venueStats}>
            <View style={styles.venueRow}>
              <Text style={styles.venueLabel}>Avg 1st Innings:</Text>
              <Text style={styles.venueValue}>{matchContext.historicalData.venueStats.averageFirstInnings}</Text>
            </View>
            <View style={styles.venueRow}>
              <Text style={styles.venueLabel}>Avg 2nd Innings:</Text>
              <Text style={styles.venueValue}>{matchContext.historicalData.venueStats.averageSecondInnings}</Text>
            </View>
            <View style={styles.venueRow}>
              <Text style={styles.venueLabel}>Highest Total:</Text>
              <Text style={styles.venueValue}>{matchContext.historicalData.venueStats.highestTotal}</Text>
            </View>
          </View>
        </View>
      </Card>

      <Card style={styles.factorsCard}>
        <Text style={styles.sectionTitle}>Key Factors</Text>
        {matchContext.keyFactors.map((factor, index) => (
          <View key={index} style={styles.factorItem}>
            <Text style={styles.factorBullet}>•</Text>
            <Text style={styles.factorText}>{factor}</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  matchCard: {
    marginBottom: Spacing.lg,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  conditionsCard: {
    marginBottom: Spacing.lg,
  },
  conditionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  conditionItem: {
    width: "48%",
    marginBottom: Spacing.sm,
  },
  conditionLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
  },
  conditionValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  tossCard: {
    marginBottom: Spacing.lg,
  },
  tossInfo: {
    marginTop: Spacing.sm,
  },
  tossRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  tossLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  tossValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  tossReason: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontStyle: "italic",
    marginTop: Spacing.xs,
  },
  teamsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  teamCard: {
    flex: 1,
  },
  teamName: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  teamComposition: {
    marginBottom: Spacing.sm,
  },
  compositionText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  keyPlayersLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
  },
  playersList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  historicalCard: {
    marginBottom: Spacing.lg,
  },
  historicalSection: {
    marginBottom: Spacing.md,
  },
  historicalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  h2hStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  h2hItem: {
    alignItems: "center",
  },
  h2hTeam: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  h2hWins: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  venueSection: {
    marginTop: Spacing.md,
  },
  venueStats: {
    gap: Spacing.xs,
  },
  venueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  venueLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  venueValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  factorsCard: {
    marginBottom: Spacing.lg,
  },
  factorItem: {
    flexDirection: "row",
    marginBottom: Spacing.sm,
  },
  factorBullet: {
    fontSize: 16,
    color: Colors.primary,
    marginRight: Spacing.sm,
  },
  factorText: {
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
    lineHeight: 20,
  },
});
