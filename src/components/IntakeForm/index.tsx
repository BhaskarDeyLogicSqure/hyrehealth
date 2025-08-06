"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ThemeLoader from "@/components/ThemeLoader";
import IntakeFormCard from "./IntakeFormCard";
import useIntakeForm from "@/hooks/useIntakeForm";
import UploadProgressPopup from "@/components/ui/UploadProgressPopup";

const IntakeForm = () => {
  const router = useRouter();

  const {
    currentStep,
    responses,
    totalSteps,
    progress,
    questions,
    getCurrentQuestionId,
    getCurrentQuestion,
    updateResponse,
    handleNext,
    handleBack,
    isSubmitting,
    uploadingFiles,
    // Upload progress popup state
    showUploadPopup,
    uploadProgress,
    uploadFileName,
    uploadError,
    uploadComplete,
    closeUploadPopup,
  } = useIntakeForm();

  const _getStepTitle = () => {
    if (currentStep === 0) {
      return "Introduction";
    }
    return `Question ${currentStep} of ${totalSteps - 1}`;
  };

  const _getNextBtnText = () => {
    return currentStep === totalSteps - 1 ? (
      isSubmitting ? (
        <ThemeLoader
          type="inline"
          variant="simple"
          size="sm"
          message="Submitting..."
          className="gap-2"
        />
      ) : (
        <>
          Submit Form
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
          </div>
        )}

        {/* Question Card */}
        <IntakeFormCard
          currentStep={currentStep}
          responses={responses}
          questions={questions}
          getCurrentQuestion={getCurrentQuestion}
          updateResponse={updateResponse}
          handleNext={handleNext}
          getCurrentQuestionId={getCurrentQuestionId}
          uploadingFiles={uploadingFiles}
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
              <Button onClick={handleNext} disabled={isSubmitting}>
                {_getNextBtnText()}
              </Button>
            )}
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

export default IntakeForm;
