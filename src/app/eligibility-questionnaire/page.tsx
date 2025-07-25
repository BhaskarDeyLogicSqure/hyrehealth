import { cookies } from "next/headers";
import { Theme } from "@/types/theme";
import { DEFAULT_THEME } from "@/lib/theme-utils";
import dynamic from "next/dynamic";
import ThemeLoader from "@/components/ThemeLoader";

interface PageProps {
  searchParams: {
    productId?: string;
    dosage?: string;
    duration?: string;
    relatedProducts?: string;
  };
}

// Dynamic import for the shared eligibility questionnaire component
const EligibilityQuestionnaire = dynamic(
  () => import("@/components/EligibilityQuestionnaire/index"),
  {
    loading: () => (
      <ThemeLoader variant="full-page" message="Loading questionnaire..." />
    ),
  }
);

const EligibilityQuestionnairePage = ({ searchParams }: PageProps) => {
  // Get current theme from cookie store
  const cookieStore = cookies();
  const theme = (cookieStore.get("theme")?.value as Theme) || DEFAULT_THEME;

  return <EligibilityQuestionnaire theme={theme} searchParams={searchParams} />;
};

export default EligibilityQuestionnairePage;
