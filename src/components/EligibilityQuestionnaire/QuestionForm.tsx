"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import useQuestionnaire from "@/hooks/useQuestionnaire";
import QuestionCard from "./QuestionCard";
import ThemeLoader from "@/components/ThemeLoader";
import UploadProgressPopup from "@/components/ui/UploadProgressPopup";

interface QuestionFormProps {
  questions: any;
  productId: string;
}

const QuestionForm = ({ questions, productId }: QuestionFormProps) => {
  const router = useRouter();

  const {
    currentStep,
    responses,
    totalSteps,
    progress,
    totalGeneralQuestions,
    totalActualQuestions,
    productSections,
    setCurrentStep,
    getCurrentQuestion,
    getCurrentStepInfo,
    updateResponse,
    handleNext,
    handleBack,
    handleContinueAfterIneligible,
    restartProduct,
    restartGeneralQuestions,
    isNavigatingToCheckout,
    isUploadingFile,
    uploadProgress,
    uploadFileName,
    showUploadPopup,
    uploadError,
    uploadComplete,
    closeUploadPopup,
  } = useQuestionnaire(questions, productId);

  const _getStepTitle = () => {
    const stepInfo = getCurrentStepInfo();

    switch (stepInfo?.type) {
      case "intro":
        return "Introduction";

      case "general":
        return `General Question ${(stepInfo?.questionIndex || 0) + 1}`;

      case "transition":
        return "Transition to Products";

      case "productIntro":
        return `${stepInfo?.productName} - Introduction`;

      case "productQuestion":
        return `${stepInfo?.productName} - Question ${
          (stepInfo?.questionIndex || 0) + 1
        }`;

      case "productResult":
        return `${stepInfo?.productName} - Result`;

      case "finalResults":
        return "Final Results";

      default:
        return "Questionnaire";
    }
  };

  const _handleNextBtn = (currentStepInfo: any) => {
    // Handle product result screens - only for eligible products now
    if (currentStepInfo?.type === "productResult") {
      const isLastProduct =
        (currentStepInfo?.productIndex || 0) === productSections?.length - 1;

      // If eligible, continue normally
      if (isLastProduct) {
        handleNext(); // Go to final results or complete
      } else {
        if (handleContinueAfterIneligible) {
          handleContinueAfterIneligible();
        } else {
          handleNext();
        }
      }
      return;
    }

    // Handle final results screen
    if (currentStepInfo?.type === "finalResults") {
      const eligibleProducts = productSections?.filter(
        (section) => section?.isEligible === true
      );

      if (eligibleProducts?.length > 0) {
        handleNext(); // Proceed to checkout
      } else {
        // No eligible products - user should review or explore other treatments
        setCurrentStep(0); // Go back to start for review
      }
      return;
    }

    // Default behavior for other steps
    handleNext();
  };

  const _getNextBtnText = (currentStepInfo: any) => {
    // Product result button text - only for eligible products
    if (currentStepInfo?.type === "productResult") {
      const isLastProduct =
        (currentStepInfo?.productIndex || 0) === productSections?.length - 1;

      return isLastProduct ? (
        <>
          Complete & Review Results
          <ArrowRight className="h-4 w-4 ml-2" />
        </>
      ) : (
        <>
          Continue to Next Product
          <ArrowRight className="h-4 w-4 ml-2" />
        </>
      );
    }

    // Final results button text
    if (currentStepInfo?.type === "finalResults") {
      const eligibleProducts = productSections?.filter(
        (section) => section?.isEligible === true
      );

      if (eligibleProducts?.length > 0) {
        return (
          <>
            Proceed to Checkout with Eligible Products
            <ArrowRight className="h-4 w-4 ml-2" />
          </>
        );
      } else {
        return (
          <>
            Review Responses
            <ArrowRight className="h-4 w-4 ml-2" />
          </>
        );
      }
    }

    // Default button text
    return currentStep === totalSteps - 1 ? (
      isNavigatingToCheckout ? (
        <ThemeLoader
          type="inline"
          variant="simple"
          size="sm"
          message="Proceeding to checkout..."
          className="gap-2"
        />
      ) : (
        <>
          Complete & Proceed to Checkout
          <ArrowRight className="h-4 w-4 ml-2" />
        </>
      )
    ) : (
      <>
        Next
        <ArrowRight className="h-4 w-4 ml-2" />
      </>
    );
  };

  return (
    <div className="min-h-screen theme-bg">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress Header */}
        {currentStep >= 0 && (
          <div className="mb-8">
            <div className="flex justify-between text-sm theme-text-muted mb-2">
              <span>{_getStepTitle()}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />

            {/* Additional progress info for multi-product flow */}
            {productSections?.length > 1 && (
              <div className="mt-2 text-xs theme-text-muted">
                {productSections?.length} products selected •{" "}
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
          totalActualQuestions={totalActualQuestions}
          productSections={productSections}
          setCurrentStep={setCurrentStep}
          handleNext={handleNext}
          getCurrentQuestion={getCurrentQuestion}
          getCurrentStepInfo={getCurrentStepInfo}
          updateResponse={updateResponse}
          handleContinueAfterIneligible={handleContinueAfterIneligible}
          restartProduct={restartProduct}
          restartGeneralQuestions={restartGeneralQuestions}
          isUploadingFile={isUploadingFile}
        />

        {/* Navigation */}
        {currentStep >= 0 && (
          <div className="flex justify-between">
            {(() => {
              const currentStepInfo = getCurrentStepInfo();

              // Hide back button for ineligible product results
              if (currentStepInfo?.type === "productResult") {
                const stepInfo =
                  productSections?.[currentStepInfo?.productIndex || 0];
                if (stepInfo?.isEligible === false) {
                  return <div></div>; // Empty div to maintain flex layout
                }
              }

              // Show back button for all other cases
              return (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              );
            })()}

            {currentStep > 0 &&
              (() => {
                const currentStepInfo = getCurrentStepInfo();

                // Don't show main button for ineligible product results (buttons are in card)
                if (currentStepInfo?.type === "productResult") {
                  const stepInfo =
                    productSections?.[currentStepInfo?.productIndex || 0];
                  if (stepInfo?.isEligible === false) {
                    return null; // No main button for ineligible products
                  }
                }

                // Show main button for all other cases
                return (
                  <Button
                    onClick={() => _handleNextBtn(currentStepInfo)}
                    disabled={isNavigatingToCheckout || isUploadingFile}
                  >
                    {_getNextBtnText(currentStepInfo)}
                  </Button>
                );
              })()}
          </div>
        )}
      </div>

      {/* Upload Progress Popup */}
      <UploadProgressPopup
        isVisible={showUploadPopup}
        progress={uploadProgress}
        fileName={uploadFileName}
        onClose={closeUploadPopup}
        isComplete={uploadComplete}
        error={uploadError}
      />
    </div>
  );
};

export default QuestionForm;
