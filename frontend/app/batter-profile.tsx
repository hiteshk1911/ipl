import { useLocalSearchParams } from "expo-router";
import { BatterProfileScreen } from "../src/features/batter-profile";

export default function BatterProfileRoute() {
  const params = useLocalSearchParams<{ batter?: string }>();
  const batter = params.batter ? decodeURIComponent(String(params.batter)) : undefined;
  return <BatterProfileScreen batterName={batter} />;
}
