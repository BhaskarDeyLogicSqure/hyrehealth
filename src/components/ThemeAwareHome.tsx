"use client";

import React from "react";
import dynamic from "next/dynamic";
import ThemeLoader from "@/components/ThemeLoader";
import { DEFAULT_THEME } from "@/lib/theme-utils";
import useMerchantDetails from "@/api/auth/useMerchantDetails";

// Dynamic imports for theme components
const DefaultHomePage = dynamic(() => import("@/themes/default/Home"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center theme-bg">
      <ThemeLoader type="general" message="Loading homepage..." size="lg" />
    </div>
  ),
});

const ClassicHomePage = dynamic(() => import("@/themes/classic/home"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center theme-bg">
      <ThemeLoader type="general" message="Loading homepage..." size="lg" />
    </div>
  ),
});

interface HomePageData {
  featuredCategories: any[];
  featuredProducts: any[];
  featuredTestimonials: any[];
}

interface ThemeAwareHomeProps {
  initialTheme: string;
  homePageData: HomePageData;
}

const ThemeAwareHome = ({
  initialTheme,
  homePageData,
}: ThemeAwareHomeProps) => {
  // Get current theme from merchant details (reactive to changes)
  const { merchantData } = useMerchantDetails();
  const theme =
    merchantData?.selectedTemplateType || initialTheme || DEFAULT_THEME;

  // Component mapping based on theme
  const ThemeComponents = {
    modern: DefaultHomePage,
    classic: ClassicHomePage,
  };

  const SelectedComponent =
    ThemeComponents[theme as keyof typeof ThemeComponents] || DefaultHomePage;

  return <SelectedComponent {...homePageData} />;
};

export default ThemeAwareHome;
