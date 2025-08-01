import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  showSuccessToast,
  showErrorToast,
} from "@/components/GlobalErrorHandler";

interface IntakeQuestion {
  _id: string;
  questionText: string;
  questionType: string;
  options?: any[];
  helpText?: string;
  required?: boolean;
}

interface IntakeFormResponse {
  questionId: string;
  answer: any;
}

const useIntakeForm = (orderId: string) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock questions for now - this would come from API
  const questions: IntakeQuestion[] = useMemo(
    () => [
      {
        _id: "q1",
        questionText: "What is your current height?",
        questionType: "number",
        helpText: "Please enter your height in inches",
        required: true,
      },
      {
        _id: "q2",
        questionText: "What is your current weight?",
        questionType: "number",
        helpText: "Please enter your weight in pounds",
        required: false,
      },
      {
        _id: "q3",
        questionText: "What is your date of birth?",
        questionType: "date",
        helpText: "Please select your date of birth",
        required: false,
      },
      {
        _id: "q4",
        questionText: "Do you have any allergies?",
        questionType: "radio",
        options: [
          { _id: "yes", label: "Yes" },
          { _id: "no", label: "No" },
        ],
        required: false,
      },
      {
        _id: "q5",
        questionText: "Please describe any current medications you are taking:",
        questionType: "textarea",
        helpText: "Include dosage and frequency",
        required: false,
      },
      {
        _id: "q6",
        questionText: "What is your primary health concern?",
        questionType: "select",
        options: [
          { _id: "weight_loss", label: "Weight Loss" },
          { _id: "hair_loss", label: "Hair Loss" },
          { _id: "skin_concerns", label: "Skin Concerns" },
          { _id: "other", label: "Other" },
        ],
        required: false,
      },
      {
        _id: "q7",
        questionText:
          "Please upload any recent lab results or medical documents:",
        questionType: "file",
        helpText: "Accepted formats: PDF, JPG, PNG (Max 10MB)",
        required: false,
      },
      {
        _id: "q8",
        questionText: "When was your last physical examination?",
        questionType: "date",
        helpText: "Please select the date of your last physical exam",
        required: false,
      },
    ],
    []
  );

  const totalSteps = questions.length + 1; // +1 for introduction

  const progress = useMemo(() => {
    if (currentStep === 0) return 0;
    return ((currentStep - 1) / (totalSteps - 2)) * 100; // -2 because we don't count intro and final step
  }, [currentStep, totalSteps]);

  const _getCurrentQuestion = (): IntakeQuestion | null => {
    if (currentStep === 0 || currentStep >= totalSteps) return null;
    return questions[currentStep - 1];
  };

  const _updateResponse = (value: any) => {
    const currentQuestion = _getCurrentQuestion();
    if (!currentQuestion) return;

    setResponses((prev) => ({
      ...prev,
      [currentQuestion?._id]: value,
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
    if (currentQuestion?.required) {
      const currentValue = responses?.[currentQuestion?._id];
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
      if (!question?.required) return false;
      const value = responses?.[question?._id];
      return !value || (Array.isArray(value) && value?.length === 0);
    });

    if (unansweredRequiredQuestions?.length > 0) {
      showErrorToast(`Please answer all required questions before submitting.`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Prepare responses for API
      const formResponses: IntakeFormResponse[] = Object.entries(responses).map(
        ([questionId, answer]) => ({
          questionId,
          answer,
        })
      );

      console.log("Submitting intake form:", {
        orderId,
        responses: formResponses,
      });

      // TODO: Replace with actual API call
      // await intakeFormApi.submitForm(orderId, formResponses);

      showSuccessToast("Intake form submitted successfully!");

      // Redirect to thank you page or order details
      router.push(`/pre-consultation?orderId=${orderId}`);
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
    setCurrentStep,
    getCurrentQuestion: _getCurrentQuestion,
    updateResponse: _updateResponse,
    handleNext: _handleNext,
    handleBack: _handleBack,
  };
};

export default useIntakeForm;
