export type ThemeName = "default" | "modern";

export const AVAILABLE_THEMES: ThemeName[] = ["default", "modern"];
export const DEFAULT_THEME: ThemeName = "default";

/**
 * Validate if a string is a valid theme name
 */
export function isValidTheme(theme: string): theme is ThemeName {
  return AVAILABLE_THEMES.includes(theme as ThemeName);
}
