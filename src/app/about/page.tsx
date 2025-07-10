"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useTheme } from "@/contexts/ThemeProvider";

// Dynamic imports for theme components
const DefaultAboutPage = dynamic(() => import("@/themes/default/about"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  ),
});

const ModernAboutPage = dynamic(() => import("@/themes/modern/about"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  ),
});

const ClassicAboutPage = dynamic(() => import("@/themes/default/about"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  ),
});

const AncientAboutPage = dynamic(() => import("@/themes/default/about"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  ),
});

const AboutPage = () => {
  // Get current theme from context
  const { theme } = useTheme();

  // Component mapping based on theme
  const ThemeComponents = {
    default: DefaultAboutPage,
    modern: ModernAboutPage,
  };

  const SelectedComponent = ThemeComponents[theme] || DefaultAboutPage;

  return <SelectedComponent />;
};

export default AboutPage;
