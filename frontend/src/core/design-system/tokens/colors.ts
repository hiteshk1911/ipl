/**
 * Design tokens: colors for light and dark themes.
 */

export const lightColors = {
  primary: "#1a73e8",
  secondary: "#34a853",
  background: "#ffffff",
  surface: "#f5f5f5",
  error: "#ea4335",
  warning: "#fbbc04",
  text: {
    primary: "#202124",
    secondary: "#5f6368",
    white: "#ffffff",
    disabled: "#9aa0a6",
  },
  border: "#dadce0",
  divider: "#e8eaed",
} as const;

export const darkColors = {
  primary: "#4285f4",
  secondary: "#81c995",
  background: "#121212",
  surface: "#1e1e1e",
  error: "#f28b82",
  warning: "#fdd663",
  text: {
    primary: "#e8eaed",
    secondary: "#9aa0a6",
    white: "#202124",
    disabled: "#5f6368",
  },
  border: "#3c4043",
  divider: "#2d2d2d",
} as const;

export type ColorTokens = typeof lightColors | typeof darkColors;
