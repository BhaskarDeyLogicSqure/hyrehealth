import { Suspense } from "react";
import QuestionForm from "./QuestionForm";
import { Theme } from "@/types/theme";
import { questionnaireApi } from "@/api/questionnaire/questionnaireApi";
import { handleServerError } from "@/lib/error-handler";
import { QuestionType } from "@/types/questionnaire";

interface EligibilityQuestionnaireProps {
  theme: Theme;
  searchParams?: {
    productId?: string;
    dosage?: string;
    duration?: string;
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

// Loading component
function QuestionnairesLoading() {
  return (
    <div className="min-h-screen theme-bg">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg p-8 shadow">
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
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
    <Suspense fallback={<QuestionnairesLoading />}>
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
  );
};

export default EligibilityQuestionnaire;
