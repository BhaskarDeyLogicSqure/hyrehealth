import { useState, useMemo, useCallback, useEffect } from "react";
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
import useUploadService from "./useUploadService";

const useIntakeForm = (orderId: string) => {
  const router = useRouter();
  const { uploadImage } = useUploadService();

  const { intakeFormDataQuestions } = useIntakeFormData();

  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());

  // Upload progress popup state
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadComplete, setUploadComplete] = useState(false);

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

  const _closeUploadPopup = () => {
    setShowUploadPopup(false);
    setUploadProgress(0);
    setUploadFileName("");
    setUploadError("");
    setUploadComplete(false);
  };

  const _handleFileUpload = async (file: File, questionId: string) => {
    try {
      setUploadingFiles((prev) => new Set(prev).add(questionId));
      setShowUploadPopup(true);
      setUploadFileName(file.name);
      setUploadProgress(0);
      setUploadError("");
      setUploadComplete(false);

      // Upload file to S3
      const uploadResult = await uploadImage(
        file,
        "intake-forms/",
        (progress) => {
          console.log(`Upload progress for ${questionId}: ${progress}%`);
          setUploadProgress(progress);
        }
      );

      if (uploadResult) {
        // Update response with uploaded file info
        const fileInfo = {
          originalFile: file,
          uploadedUrl: uploadResult.url,
          filename: uploadResult.filename,
          contentType: uploadResult.contentType,
          size: file.size,
          name: file.name,
        };

        _updateResponse(fileInfo);
        setUploadComplete(true);
        setUploadProgress(100);

        // Auto-hide popup after 2 seconds
        setTimeout(() => {
          _closeUploadPopup();
        }, 2000);

        showSuccessToast("File uploaded successfully!");
      } else {
        setUploadError("Failed to upload file. Please try again.");
        showErrorToast("Failed to upload file. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadError("Failed to upload file. Please try again.");
      showErrorToast("Failed to upload file. Please try again.");
    } finally {
      setUploadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
    }
  };

  const _updateResponseWithFileUpload = async (value: any) => {
    const currentQuestion = _getCurrentQuestion();
    if (!currentQuestion) return;

    // Store file locally without uploading immediately
    if (value instanceof File) {
      // Store the file object locally for later upload
      _updateResponse({
        originalFile: value,
        name: value.name,
        size: value.size,
        type: value.type,
        uploadedUrl: null, // Will be set after upload
      });
    } else {
      // For non-file values, update directly
      _updateResponse(value);
    }
  };

  const _uploadPendingFiles = async () => {
    const currentQuestion = _getCurrentQuestion();
    if (!currentQuestion) return;

    const questionId = _getCurrentQuestionId();
    const currentValue = responses?.[questionId];

    // Check if current question has a file that needs uploading
    if (
      currentValue &&
      typeof currentValue === "object" &&
      currentValue?.originalFile instanceof File &&
      !currentValue?.uploadedUrl
    ) {
      await _handleFileUpload(currentValue.originalFile, questionId);
    }
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

    // Upload any pending files before proceeding
    await _uploadPendingFiles();

    if (currentStep === totalSteps - 1) {
      // Final step - submit form
      await _handleSubmit();
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

  const _handleSubmit = async () => {
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
            // Handle file uploads - send the uploaded URL instead of file object
            let processedAnswer = answer;
            if (answer && typeof answer === "object" && answer.uploadedUrl) {
              processedAnswer = answer.uploadedUrl;
            }

            return {
              _question: questionId || undefined,
              answer: processedAnswer || undefined,
            };
          }
        );
      }

      console.log("Submitting intake form:", {
        payload,
      });
      await postCheckoutApi.submitIntakeFormQuestions(payload);

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

  useEffect(() => {
    if (!orderId) {
      showErrorToast("No order ID found");
      router.push("/");
    }
  }, [orderId]);

  // Auto-proceed if no questions are available
  useEffect(() => {
    // If questions have been loaded and there are no questions, automatically proceed
    if (intakeFormDataQuestions && !questions?.length) {
      // showSuccessToast(
      //   "No intake questions available. Proceeding to next step."
      // );
      router.push(`/pre-consultation?orderId=${orderId}`);
    }
  }, [intakeFormDataQuestions, questions, orderId]);

  return {
    currentStep,
    responses,
    totalSteps,
    progress,
    questions,
    isSubmitting,
    uploadingFiles,
    // Upload progress popup state
    showUploadPopup,
    uploadProgress,
    uploadFileName,
    uploadError,
    uploadComplete,
    closeUploadPopup: _closeUploadPopup,
    getCurrentQuestion: _getCurrentQuestion,
    getCurrentQuestionId: _getCurrentQuestionId,
    updateResponse: _updateResponseWithFileUpload,
    handleNext: _handleNext,
    handleBack: _handleBack,
  };
};

export default useIntakeForm;
