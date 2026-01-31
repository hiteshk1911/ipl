import type { ColorTokens } from "./tokens/colors";
import type { SpacingTokens } from "./tokens/spacing";
import type { TypographyTokens } from "./tokens/typography";
import { lightColors } from "./tokens/colors";
import { darkColors } from "./tokens/colors";
import { spacing } from "./tokens/spacing";
import { typography } from "./tokens/typography";
import { radius, shadows } from "./tokens/radius";

export type Theme = {
  colors: ColorTokens;
  spacing: SpacingTokens;
  typography: TypographyTokens;
  radius: typeof radius;
  shadows: typeof shadows;
};

export type ColorTokensLight = typeof lightColors;
export type ColorTokensDark = typeof darkColors;

export const lightTheme: Theme = {
  colors: lightColors,
  spacing,
  typography,
  radius,
  shadows,
};

export const darkTheme: Theme = {
  colors: darkColors,
  spacing,
  typography,
  radius,
  shadows,
};
