import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeTokens } from "../../src/core/design-system/ThemeContext";

interface ScreenLayoutProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: boolean;
}

export function ScreenLayout({ children, style, padding = true }: ScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const theme = useThemeTokens();

  return (
    <View
      style={[
        styles.container,
        {
          flex: 1,
          backgroundColor: theme.colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left + (padding ? theme.spacing.md : 0),
          paddingRight: insets.right + (padding ? theme.spacing.md : 0),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
