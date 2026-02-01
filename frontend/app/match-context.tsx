import { useLocalSearchParams } from "expo-router";
import { MatchContextScreen } from "../src/features/match-context";

export default function MatchContextRoute() {
  const params = useLocalSearchParams<{ match_id?: string }>();
  const matchId = params.match_id ? String(params.match_id) : undefined;
  return <MatchContextScreen matchId={matchId} />;
}
