import React from "react";
import { cookies } from "next/headers";
import { Theme } from "@/types/theme";
import { DEFAULT_THEME } from "@/lib/theme-utils";
import dynamic from "next/dynamic";
import ThemeLoader from "@/components/ThemeLoader";

// Dynamic import for the shared renewal component
const ConsultationRenewalComponent = dynamic(
  () => import("@/components/ConsultationRenewal"),
  {
    loading: () => <ThemeLoader variant="full-page" message="Loading..." />,
  }
);

const Renewal = () => {
  // Get current theme from cookie store
  const cookieStore = cookies();
  const theme = (cookieStore.get("theme")?.value as Theme) || DEFAULT_THEME;

  return <ConsultationRenewalComponent />;
};

export default Renewal;
