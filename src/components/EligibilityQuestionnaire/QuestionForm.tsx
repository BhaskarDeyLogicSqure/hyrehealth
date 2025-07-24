"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Theme } from "@/types/theme";
import useQuestionnaire from "@/hooks/useQuestionnaire";
import QuestionCard from "./QuestionCard";

interface QuestionFormProps {
  theme: Theme;
  questions: any;
  productId: string;
  dosage: string;
  duration: string;
  totalQuestions: number;
}

const QuestionForm = ({
  theme,
  questions,
  productId,
  dosage,
  duration,
  totalQuestions,
}: QuestionFormProps) => {
  const router = useRouter();

  const {
    currentStep,
    responses,
    totalSteps,
    progress,
    totalGeneralQuestions,
    // questionsList,
    // totalProductQuestions,
    // currentQuestionIndex,
    totalActualQuestions,
    productSections,
    setCurrentStep,
    getCurrentQuestion,
    getCurrentStepInfo,
    updateResponse,
    handleNext,
    handleBack,
    // handleContinueAfterIneligible,
  } = useQuestionnaire(questions, productId, dosage, duration);

  const getStepTitle = () => {
    const stepInfo = getCurrentStepInfo();

    switch (stepInfo.type) {
      case "intro":
        return "Introduction";

      case "general":
        return `General Question ${(stepInfo.questionIndex || 0) + 1}`;

      case "transition":
        return "Transition to Products";

      case "productIntro":
        return `${stepInfo.productName} - Introduction`;

      case "productQuestion":
        return `${stepInfo.productName} - Question ${
          (stepInfo.questionIndex || 0) + 1
        }`;

      case "productResult":
        return `${stepInfo.productName} - Result`;

      default:
        return "Questionnaire";
    }
  };

  return (
    <div className="min-h-screen theme-bg">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress Header */}
        {currentStep >= 0 && (
          <div className="mb-8">
            <div className="flex justify-between text-sm theme-text-muted mb-2">
              <span>{getStepTitle()}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />

            {/* Additional progress info for multi-product flow */}
            {productSections.length > 1 && (
              <div className="mt-2 text-xs theme-text-muted">
                {productSections.length} products selected •{" "}
                {totalActualQuestions} total questions
              </div>
            )}
          </div>
        )}

        {/* Question Card */}
        <QuestionCard
          currentStep={currentStep}
          responses={responses}
          totalGeneralQuestions={totalGeneralQuestions}
          // productId={productId}
          // totalProductQuestions={totalProductQuestions}
          // currentQuestionIndex={currentQuestionIndex}
          totalActualQuestions={totalActualQuestions}
          productSections={productSections}
          setCurrentStep={setCurrentStep}
          handleNext={handleNext}
          getCurrentQuestion={getCurrentQuestion}
          getCurrentStepInfo={getCurrentStepInfo}
          updateResponse={updateResponse}
          // handleBack={handleBack}
          // handleContinueAfterIneligible={handleContinueAfterIneligible}
        />

        {/* Navigation */}
        {currentStep >= 0 && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            {currentStep > 0 && (
              <Button onClick={handleNext}>
                {currentStep === totalSteps - 1 ? (
                  <>
                    Complete & Proceed to Checkout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionForm;
