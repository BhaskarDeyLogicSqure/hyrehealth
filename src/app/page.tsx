import React from "react";
import { cookies } from "next/headers";
import { Theme } from "@/types/theme";
import { DEFAULT_THEME } from "@/lib/theme-utils";
import ThemeAwareHome from "@/components/ThemeAwareHome";
import { getHomePageData } from "@/utils/getHomePageData";

const HomePage = async () => {
  // Get initial theme from cookie store (SSR)
  const cookieStore = cookies();
  const initialTheme =
    (cookieStore.get("theme")?.value as Theme) || DEFAULT_THEME;

  // Fetch home page data server-side
  const homePageData = await getHomePageData();

  // Use client wrapper to handle theme reactivity
  return (
    <ThemeAwareHome initialTheme={initialTheme} homePageData={homePageData} />
  );
};

export default HomePage;
