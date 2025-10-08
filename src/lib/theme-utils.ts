import { Theme } from "@/types/theme";

export const AVAILABLE_THEMES: Theme[] = [Theme.DEFAULT, Theme.CLASSIC]; // add more themes here

export const DEFAULT_THEME: Theme = Theme.DEFAULT;

/**
 * Validate if a string is a valid theme name
 */
export function isValidTheme(theme: string): theme is Theme {
  return AVAILABLE_THEMES.includes(theme as Theme);
}
