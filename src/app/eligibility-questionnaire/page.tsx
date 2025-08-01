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
  return <EligibilityQuestionnaire searchParams={searchParams} />;
};

export default EligibilityQuestionnairePage;
