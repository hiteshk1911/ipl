import React, { useEffect } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { useThemeTokens } from "../../src/core/design-system/ThemeContext";

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = "100%", height = 20, borderRadius = 4, style }: SkeletonProps) {
  const theme = useThemeTokens();
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.8, { duration: 800 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const containerStyle: ViewStyle = {
    width: width as ViewStyle["width"],
    height: height as ViewStyle["height"],
    borderRadius,
    backgroundColor: theme.colors.divider,
  };

  return (
    <Animated.View
      style={[styles.base, containerStyle, animatedStyle, style]}
    />
  );
}

const styles = StyleSheet.create({
  base: {},
});
