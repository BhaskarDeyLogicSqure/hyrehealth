import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  showSuccessToast,
  showErrorToast,
} from "@/components/GlobalErrorHandler";
import { useIntakeFormData } from "@/api/postCheckout/useIntakeFormData";
import {
  IntakeFormQuestion,
  IntakeFormResponsePayload,
} from "@/types/intakeForms";
import { postCheckoutApi } from "@/api/postCheckout/postCheckoutApi";
const useIntakeForm = () => {
  const router = useRouter();

  const {
    intakeFormDataQuestions,
    isIntakeFormLoading,
    isIntakeFormError,
    intakeFormError,
  } = useIntakeFormData();

  console.log({
    intakeFormDataQuestions,
    isIntakeFormLoading,
    isIntakeFormError,
    intakeFormError,
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = useMemo(
    () => intakeFormDataQuestions || [],
    [intakeFormDataQuestions]
  );

  const totalSteps = questions?.length + 1; // +1 for introduction

  const progress = useMemo(() => {
    if (currentStep === 0) return 0;
    return ((currentStep - 1) / (totalSteps - 2)) * 100; // -2 because we don't count intro and final step
  }, [currentStep, totalSteps]);

  const _getCurrentQuestion = useCallback((): IntakeFormQuestion | null => {
    if (currentStep === 0 || currentStep >= totalSteps) return null;
    return questions[currentStep - 1];
  }, [currentStep, questions, totalSteps]);

  const _getCurrentQuestionId = useCallback((): string => {
    const currentQuestion = _getCurrentQuestion();
    return currentQuestion?.question?._id || "";
  }, [_getCurrentQuestion]);

  const _updateResponse = (value: any) => {
    const currentQuestion = _getCurrentQuestion();
    if (!currentQuestion) return;

    setResponses((prev) => ({
      ...prev,
      [_getCurrentQuestionId()]: value,
    }));
  };

  const _handleNext = async () => {
    if (currentStep === 0) {
      // Introduction step - move to first question
      setCurrentStep(1);
      return;
    }

    // Check if current question is required and answered
    const currentQuestion = _getCurrentQuestion();
    if (currentQuestion?.isRequired) {
      const currentValue = responses?.[_getCurrentQuestionId()];
      if (
        !currentValue ||
        (Array.isArray(currentValue) && currentValue?.length === 0)
      ) {
        showErrorToast(`Answer is required for this question`);
        return;
      }
    }

    if (currentStep === totalSteps - 1) {
      // Final step - submit form
      await handleSubmit();
      return;
    }

    // Move to next question
    setCurrentStep((prev) => prev + 1);
  };

  const _handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else if (currentStep === 0) {
      router.back();
    }
  };

  const handleSubmit = async () => {
    // Check if all required questions are answered
    const unansweredRequiredQuestions = questions?.filter((question) => {
      if (!question?.isRequired) return false;
      const value = responses?.[_getCurrentQuestionId()];
      return !value || (Array.isArray(value) && value?.length === 0);
    });

    if (unansweredRequiredQuestions?.length > 0) {
      showErrorToast(`Please answer all required questions before submitting.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: IntakeFormResponsePayload = {
        _intakeForm: "",
        questionnaireResponses: [] as {
          _question: string | undefined;
          answer: string | string[] | undefined;
        }[],
      };

      // Prepare responses for API
      if (responses && Object.keys(responses)?.length > 0) {
        payload["questionnaireResponses"] = Object.entries(responses)?.map(
          ([questionId, answer]) => {
            return {
              _question: questionId || undefined,
              answer: answer || undefined,
            };
          }
        );
      }

      console.log("Submitting intake form:", {
        payload,
      });

      const response = await postCheckoutApi.submitIntakeFormQuestions(payload);
      console.log({ response });
      showSuccessToast("Intake form submitted successfully!");
      // Redirect to thank you page or order details
      router.push(`/pre-consultation`);
    } catch (error) {
      console.error("Error submitting intake form:", error);
      showErrorToast("Failed to submit intake form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    responses,
    totalSteps,
    progress,
    questions,
    isSubmitting,
    getCurrentQuestion: _getCurrentQuestion,
    getCurrentQuestionId: _getCurrentQuestionId,
    updateResponse: _updateResponse,
    handleNext: _handleNext,
    handleBack: _handleBack,
  };
};

export default useIntakeForm;
