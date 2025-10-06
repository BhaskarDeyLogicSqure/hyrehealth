import React from "react";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { Theme } from "@/types/theme";
import { DEFAULT_THEME } from "@/lib/theme-utils";
import ThemeLoader from "@/components/ThemeLoader";

// Dynamic imports for theme components
//  --------- Default Theme ---------
const DefaultHomePage = dynamic(() => import("@/themes/default/Home"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center theme-bg">
      <ThemeLoader type="general" message="Loading homepage..." size="lg" />
    </div>
  ),
});

//  --------- Modern Theme ---------
const ClassicHomePage = dynamic(() => import("@/themes/classic/home"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center theme-bg">
      <ThemeLoader type="general" message="Loading homepage..." size="lg" />
    </div>
  ),
});

// --------- Add more theme exports here ---------

const HomePage = () => {
  // Get current theme from cookie store
  const cookieStore = cookies(); // get the cookie store
  // const theme = (cookieStore.get("theme")?.value as Theme) || DEFAULT_THEME;
  const theme = "classic";

  // Component mapping based on theme
  const ThemeComponents = {
    default: DefaultHomePage,
    classic: ClassicHomePage,
  };

  const SelectedComponent = ThemeComponents[theme] || DefaultHomePage;

  return <SelectedComponent />;
};

export default HomePage;
