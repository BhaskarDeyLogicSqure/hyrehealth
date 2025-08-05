import { Suspense } from "react";
import QuestionForm from "./QuestionForm";
import { questionnaireApi } from "@/api/questionnaire/questionnaireApi";
import { handleServerError } from "@/lib/error-handler";
import { QuestionType } from "@/types/questionnaire";
import ThemeLoader from "@/components/ThemeLoader";

interface EligibilityQuestionnaireProps {
  searchParams?: {
    productId?: string;
    relatedProducts?: string;
  };
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
  searchParams = {},
}: EligibilityQuestionnaireProps) => {
  const productId = searchParams.productId || "";
  const relatedProductIds = searchParams?.relatedProducts || "";

  // Fetch questions from API
  let questionsList;

  try {
    // pass productId and relatedProducts id as array
    const questionsResponse = await questionnaireApi.getQuestionnaire([
      productId, // main product id
      ...(relatedProductIds ? relatedProductIds?.split(",") : []), // array of related product ids
    ]);

    questionsList = questionsResponse?.data;
  } catch (error: any) {
    handleServerError(error, {
      customMessage: "Failed to load questionnaire",
      redirectTo: "/products",
      // redirectToPrevious: true,
      showToast: true,
      logError: true,
    });
  }

  return (
    <div className="theme-bg min-h-screen">
      <Suspense
        fallback={
          <ThemeLoader variant="full-page" message="Loading questionnaire..." />
        }
      >
        <QuestionForm questions={questionsList} productId={productId} />
      </Suspense>
    </div>
  );
};

export default EligibilityQuestionnaire;
