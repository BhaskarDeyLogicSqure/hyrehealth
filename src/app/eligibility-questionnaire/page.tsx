import { cookies } from "next/headers";
import { Theme } from "@/types/theme";
import { DEFAULT_THEME } from "@/lib/theme-utils";
import dynamic from "next/dynamic";

// Dynamic import for the shared eligibility questionnaire component
const EligibilityQuestionnaire = dynamic(
  () => import("@/components/EligibilityQuestionnaire"),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    ),
  }
);

const EligibilityQuestionnairePage = () => {
  // Get current theme from cookie store
  const cookieStore = cookies();
  const theme = (cookieStore.get("theme")?.value as Theme) || DEFAULT_THEME;

  return <EligibilityQuestionnaire theme={theme} />;
};

export default EligibilityQuestionnairePage;
