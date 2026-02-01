import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { ThemeProvider } from "../src/core/design-system/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          screenOptions={{
            headerStyle: { backgroundColor: "#1a73e8" },
            headerTintColor: "#ffffff",
            drawerActiveTintColor: "#1a73e8",
            drawerInactiveTintColor: "#5f6368",
          }}
        >
          <Drawer.Screen name="index" options={{ title: "Matchup Analysis" }} />
          <Drawer.Screen name="batter-profile" options={{ title: "Batter Profile" }} />
          <Drawer.Screen name="compare-matchups" options={{ title: "Compare Matchups" }} />
          <Drawer.Screen name="match-context" options={{ title: "Match Context" }} />
        </Drawer>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
