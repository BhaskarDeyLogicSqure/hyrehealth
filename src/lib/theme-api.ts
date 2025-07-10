import { DEFAULT_THEME, AVAILABLE_THEMES } from "./theme-utils";
import { Theme } from "@/types/theme";
import axios from "axios";

/**
 * Fetch theme from backend API (server-side)
 * This can be used in Server Components or API routes
 */
export async function fetchThemeFromAPIServer(
  requestHeaders?: Record<string, string>
): Promise<Theme> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const url = `${baseUrl}/theme`;

    // const themeResponse = await axios.get(url);

    // const theme = themeResponse?.data?.userColourTheme as Theme;

    // console.log("theme 1234 ", theme);
    // if (theme && AVAILABLE_THEMES?.includes(theme)) {
    //   return theme;
    // }
    console.log("saucvik");

    return DEFAULT_THEME;
  } catch (error) {
    console.warn("Failed to fetch theme from API (server):", error);
    return DEFAULT_THEME;
  }
}
