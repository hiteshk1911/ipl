import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Colors } from "../constants/colors";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.text.white,
          drawerActiveTintColor: Colors.primary,
          drawerInactiveTintColor: Colors.text.secondary,
        }}
      >
        <Drawer.Screen name="index" options={{ title: "Matchup Analysis" }} />
        <Drawer.Screen name="batter-profile" options={{ title: "Batter Profile" }} />
        <Drawer.Screen name="detailed-insights" options={{ title: "Detailed Insights" }} />
        <Drawer.Screen name="match-context" options={{ title: "Match Context" }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
