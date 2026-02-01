import { useLocalSearchParams } from "expo-router";
import { CompareMatchupsScreen } from "../src/features/compare-matchups";

export default function CompareMatchupsRoute() {
  const params = useLocalSearchParams<{ batter?: string }>();
  const batter = params.batter ? decodeURIComponent(String(params.batter)) : undefined;
  return <CompareMatchupsScreen initialBatter={batter} />;
}
