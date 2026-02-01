import React, { createContext, useContext, useMemo, useState } from "react";
import type { Theme } from "./theme";
import { lightTheme, darkTheme } from "./theme";

type ColorScheme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const value = useMemo(
    () => ({
      theme,
      colorScheme,
      setColorScheme,
      toggleColorScheme: () => setColorScheme((s) => (s === "light" ? "dark" : "light")),
    }),
    [theme, colorScheme]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

/** Hook that returns only the theme object (for components that don't need toggling). */
export function useThemeTokens(): Theme {
  return useTheme().theme;
}
