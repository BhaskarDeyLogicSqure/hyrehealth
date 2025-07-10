import { getTheme } from "@/api/theme/themeApi";
import { ThemeName, DEFAULT_THEME, AVAILABLE_THEMES } from "./theme-utils";

/**
 * Fetch theme from backend API (server-side)
 * This can be used in Server Components or API routes
 */
export async function fetchThemeFromAPIServer(
  requestHeaders?: Record<string, string>
): Promise<ThemeName> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = `${baseUrl}/theme`;

    const themeResponse = await getTheme.data;

    const theme = themeResponse?.data?.userColourTheme as ThemeName;

    console.log("theme 1234 ", theme);
    if (theme && AVAILABLE_THEMES?.includes(theme)) {
      return theme;
    }

    return DEFAULT_THEME;
  } catch (error) {
    console.warn("Failed to fetch theme from API (server):", error);
    return DEFAULT_THEME;
  }
}
