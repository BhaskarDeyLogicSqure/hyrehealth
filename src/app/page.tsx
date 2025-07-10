"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useTheme } from "@/contexts/ThemeProvider";

// Dynamic imports for theme components
const DefaultHomePage = dynamic(() => import("@/themes/default/home"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  ),
});

const ModernHomePage = dynamic(() => import("@/themes/modern/home"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  ),
});

const HomePage = () => {
  // Get current theme from context
  const { theme } = useTheme();

  // Component mapping based on theme
  const ThemeComponents = {
    default: DefaultHomePage,
    modern: ModernHomePage,
  };

  const SelectedComponent = ThemeComponents[theme] || DefaultHomePage;

  return <SelectedComponent />;
};

export default HomePage;
