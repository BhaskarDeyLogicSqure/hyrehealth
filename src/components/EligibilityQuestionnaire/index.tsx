import { Suspense } from "react";
import QuestionForm from "./QuestionForm";
import { Theme } from "@/types/theme";
import { questionnaireApi } from "@/api/questionnaire/questionnaireApi";
import { handleServerError } from "@/lib/error-handler";
import { QuestionType } from "@/types/questionnaire";
import ThemeLoader from "@/components/ThemeLoader";

interface EligibilityQuestionnaireProps {
  theme: Theme;
  searchParams?: {
    productId?: string;
    dosage?: string;
    duration?: string;
    relatedProducts?: string;
  };
}

interface QuestionField {
  name: string;
  label: string;
  type: QuestionType;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[] | string[];
  validation?: (value: any) => string | null;
}

// Define question types
export interface Question {
  id: string;
  title: string;
  type: QuestionType;
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[] | string[];
  validation?: (value: any) => string | null;
}

// Server Component
const EligibilityQuestionnaire = async ({
  theme,
  searchParams = {},
}: EligibilityQuestionnaireProps) => {
  const productId = searchParams.productId || "";
  const relatedProductIds = searchParams?.relatedProducts || "";
  const dosage = searchParams.dosage || "";
  const duration = searchParams.duration || "";

  // Fetch questions from API
  let questionsList;
  let totalQuestions = 0;
  try {
    // pass productId and relatedProducts id as array
    const questionsResponse = await questionnaireApi.getQuestionnaire([
      productId,
      ...(relatedProductIds ? relatedProductIds?.split(",") : []),
    ]);

    questionsList = questionsResponse?.data;
    totalQuestions = questionsResponse?.total;
  } catch (error: any) {
    // console.error("Error fetching questions:", error);
    // questionsList = [];
    console.log("error", error);
    handleServerError(error, {
      customMessage: "Failed to load questionnaire",
      redirectTo: "/products",
      // redirectToPrevious: true,
      showToast: true,
      logError: true,
    });
  }

  // console.log("questionsList", questionsList, totalQuestions);
  return (
    <div className="theme-bg min-h-screen">
      <Suspense
        fallback={
          <ThemeLoader variant="full-page" message="Loading questionnaire..." />
        }
      >
        <QuestionForm
          theme={theme}
          questions={questionsList}
          productId={productId}
          dosage={dosage}
          duration={duration}
          totalQuestions={totalQuestions}
          // relatedProducts={relatedProducts}
        />
      </Suspense>
    </div>
  );
};

export default EligibilityQuestionnaire;
