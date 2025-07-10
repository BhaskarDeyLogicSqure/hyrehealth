import { ThemeName, DEFAULT_THEME, AVAILABLE_THEMES } from "./theme-utils";

// API endpoint configuration
const THEME_API_ENDPOINT =
  process.env.NEXT_PUBLIC_THEME_API_URL || "/api/theme";

/**
 * Fetch theme from backend API (client-side)
 */
export async function fetchThemeFromAPI(): Promise<ThemeName> {
  try {
    const response = await fetch(THEME_API_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for authentication if needed
    });

    if (!response.ok) {
      console.warn(
        `Theme API returned ${response.status}, using default theme`
      );
      return DEFAULT_THEME;
    }

    const data = await response.json();
    const theme = data.theme as ThemeName;

    if (theme && AVAILABLE_THEMES.includes(theme)) {
      return theme;
    }

    return DEFAULT_THEME;
  } catch (error) {
    console.warn("Failed to fetch theme from API:", error);
    return DEFAULT_THEME;
  }
}

/**
 * Fetch theme from backend API (server-side)
 * This can be used in Server Components or API routes
 */
export async function fetchThemeFromAPIServer(
  requestHeaders?: Record<string, string>
): Promise<ThemeName> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const url = `${baseUrl}/api/theme`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...requestHeaders, // Forward cookies or auth headers
      },
    });

    console.log("response 1234 ", response);
    if (!response.ok) {
      console.warn(
        `Theme API returned ${response.status}, using default theme`
      );
      return DEFAULT_THEME;
    }

    const data = await response.json();
    console.log("data 1234 ", data);
    const theme = data.theme as ThemeName;

    console.log("theme 1234 ", theme);
    if (theme && AVAILABLE_THEMES.includes(theme)) {
      return theme;
    }

    return DEFAULT_THEME;
  } catch (error) {
    console.warn("Failed to fetch theme from API (server):", error);
    return DEFAULT_THEME;
  }
}
