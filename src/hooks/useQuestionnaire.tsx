import { Question, QuestionType } from "@/types/questionnaire";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  setGeneralEligibility,
  addProductResponses,
  setProductEligibility,
  completeQuestionnaire,
  QuestionnaireResponse,
  ProductEligibility,
} from "@/store/slices/checkoutSlice";
import {
  showSuccessToast,
  showErrorToast,
} from "@/components/GlobalErrorHandler";
import useUploadService from "./useUploadService";

interface ProductSection {
  productId: string;
  productName: string;
  questions: Question[];
  isEligible: boolean | null; // null = not evaluated yet, true = eligible, false = ineligible
}

const useQuestionnaire = (
  questions: Record<string, any>,
  productId: string
) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { uploadImage } = useUploadService();

  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [questionsList, setQuestionsList] = useState<Record<string, any>>({});
  // const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isNavigatingToCheckout, setIsNavigatingToCheckout] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFileName, setUploadFileName] = useState<string>("");
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [uploadComplete, setUploadComplete] = useState(false);

  // Parse product sections from questionsList
  const productSections: ProductSection[] = useMemo(() => {
    const sections: ProductSection[] = [];

    Object.keys(questionsList).forEach((key) => {
      if (key !== "generalQuestions" && Array.isArray(questionsList?.[key])) {
        // Extract product name from key or use a default naming convention
        const productName =
          key?.split("_")?.[1]?.charAt(0)?.toUpperCase() +
          key?.split("_")?.[1]?.slice(1);

        sections?.push({
          productId: key,
          productName: productName || key,
          questions: questionsList[key],
          isEligible: null,
        });
      }
    });

    return sections;
  }, [questionsList]);

  const totalGeneralQuestions = questionsList?.generalQuestions?.length || 0;
  const totalProductSections = productSections.length;

  // Calculate step structure:
  // 1. Intro (1 step)
  // 2. General questions (n steps)
  // 3. Transition to products (1 step, if products exist)
  // 4. For each product:
  //    - Product intro/transition (1 step)
  //    - Product questions (n steps)
  //    - Product eligibility result (1 step)
  // 5. Final results summary (1 step)
  // 6. Final completion (handled separately)

  const stepStructure = useMemo(() => {
    const structure: Array<{
      type:
        | "intro"
        | "general"
        | "transition"
        | "productIntro"
        | "productQuestion"
        | "productResult"
        | "finalResults";
      productIndex?: number;
      questionIndex?: number;
      productId?: string;
      productName?: string;
    }> = [];

    const _extractProductId = (productIdString: string) => {
      return productIdString?.split("_")?.[0];
    };

    // 1. Intro
    structure?.push({ type: "intro" });

    // 2. General questions
    for (let i = 0; i < totalGeneralQuestions; i++) {
      structure?.push({ type: "general", questionIndex: i });
    }

    // 3. Transition to products (if any products exist)
    if (totalProductSections > 0) {
      structure?.push({ type: "transition" });
    }

    // 4. Product sections
    productSections.forEach((section, productIndex) => {
      // Product intro
      structure?.push({
        type: "productIntro",
        productIndex,
        productId: _extractProductId(section?.productId),
        productName: section?.productName,
      });

      // Product questions
      section?.questions?.forEach((_, questionIndex) => {
        structure?.push({
          type: "productQuestion",
          productIndex,
          questionIndex,
          productId: _extractProductId(section?.productId),
          productName: section?.productName,
        });
      });

      // Product result
      structure?.push({
        type: "productResult",
        productIndex,
        productId: _extractProductId(section?.productId),
        productName: section?.productName,
      });
    });

    // 5. Final results summary (if multiple products)
    if (totalProductSections > 1) {
      structure?.push({ type: "finalResults" });
    }

    return structure;
  }, [totalGeneralQuestions, productSections, totalProductSections]);

  // totalSteps is the total number of steps in the questionnaire including the intro, general questions, transition, product intro, product questions, and product result steps
  const totalSteps = stepStructure?.length;

  // Calculate progress based on actual questions answered
  const { progress, currentQuestionIndex, totalActualQuestions } =
    useMemo(() => {
      const totalQuestions =
        totalGeneralQuestions +
        productSections.reduce(
          (sum, section) => sum + section.questions.length,
          0
        );

      let questionsAnswered = 0;
      const currentStepInfo = stepStructure[currentStep];

      if (currentStepInfo) {
        // Count completed general questions
        if (currentStepInfo.type === "general") {
          questionsAnswered = (currentStepInfo.questionIndex || 0) + 1;
        } else if (
          [
            "transition",
            "productIntro",
            "productQuestion",
            "productResult",
          ].includes(currentStepInfo.type)
        ) {
          questionsAnswered = totalGeneralQuestions;

          // Count completed product questions
          for (let i = 0; i < productSections.length; i++) {
            if (
              currentStepInfo.type === "productQuestion" &&
              currentStepInfo.productIndex === i
            ) {
              questionsAnswered += (currentStepInfo.questionIndex || 0) + 1;
              break;
            } else if (
              (currentStepInfo.type === "productResult" &&
                currentStepInfo.productIndex === i) ||
              (currentStepInfo.productIndex !== undefined &&
                currentStepInfo.productIndex > i)
            ) {
              questionsAnswered += productSections[i].questions.length;
            }
          }
        }
      }

      return {
        totalActualQuestions: totalQuestions,
        currentQuestionIndex: questionsAnswered,
        progress:
          totalQuestions > 0 ? (questionsAnswered / totalQuestions) * 100 : 0,
      };
    }, [currentStep, stepStructure, totalGeneralQuestions, productSections]);

  const _getAllQuestions = () => {
    const allQuestions: Record<string, any> = {};
    Object.keys(questions ?? {})?.forEach((key) => {
      allQuestions[key] = questions?.[key];
    });
    setQuestionsList(allQuestions);
  };

  const _getCurrentQuestion = () => {
    const currentStepInfo = stepStructure[currentStep];
    if (!currentStepInfo) return null;

    switch (currentStepInfo.type) {
      case "general":
        const generalIndex = currentStepInfo.questionIndex;
        return generalIndex !== undefined
          ? questionsList?.generalQuestions?.[generalIndex]
          : null;

      case "productQuestion":
        const productIndex = currentStepInfo.productIndex;
        const questionIndex = currentStepInfo.questionIndex;
        if (productIndex !== undefined && questionIndex !== undefined) {
          return productSections[productIndex]?.questions[questionIndex];
        }
        return null;

      default:
        return null; // For intro, transition, productIntro, productResult steps
    }
  };

  // Get current step info for UI rendering
  const _getCurrentStepInfo = () => {
    return stepStructure[currentStep] || { type: "intro" };
  };

  // Calculate eligibility for a specific product based on current responses
  const _calculateProductEligibility = (productIndex: number) => {
    const productSection = productSections[productIndex];
    if (!productSection) return false;

    // Check all answered questions for this product
    for (const question of productSection?.questions) {
      if (question?.hasCorrectOption) {
        const userResponse = responses[question?._id];

        if (!userResponse) {
          // Question not answered yet, assume eligible for now
          continue;
        }

        // Check if user selected correct option(s)
        const hasCorrectAnswer = _checkIfAnswerIsCorrect(
          question,
          userResponse
        );
        if (!hasCorrectAnswer) {
          return false; // Ineligible for this product
        }
      }
    }

    return true; // Eligible for this product
  };

  // Helper function to check if an answer is correct
  const _checkIfAnswerIsCorrect = (question: any, userResponse: any) => {
    console.log("question", question);
    console.log("userResponse", userResponse);
    if (!question?.hasCorrectOption) {
      return true; // No validation needed
    }

    const options = question?.options || [];

    if (
      question?.questionType === QuestionType.Radio ||
      question?.questionType === QuestionType.Select ||
      question?.questionType === QuestionType.Dropdown
    ) {
      // For single-select questions, userResponse is the option _id
      const selectedOption = options?.find(
        (opt: any) => opt?._id === userResponse
      );
      console.log("selectedOption", selectedOption);
      return selectedOption?.isCorrect === true;
    }

    // For checkbox questions, userResponse is an array of option _ids
    if (question?.questionType === QuestionType.Checkbox) {
      if (Array.isArray(userResponse)) {
        // All selected options must be correct
        return userResponse?.every((responseId) => {
          const selectedOption = options?.find(
            (opt: any) => opt?._id === responseId
          );
          return selectedOption?.isCorrect === true;
        });
      } else {
        // Single checkbox value
        const selectedOption = options?.find(
          (opt: any) => opt?._id === userResponse
        );
        return selectedOption?.isCorrect === true;
      }
    }

    // For other question types, you might need additional logic
    return true;
  };

  // Calculate general questions eligibility
  const _calculateGeneralEligibility = () => {
    const generalQuestions = questionsList?.generalQuestions || [];

    for (const question of generalQuestions) {
      if (question?.hasCorrectOption) {
        const userResponse = responses?.[question?._id];

        if (!userResponse) {
          continue; // Question not answered yet
        }

        const isAnswerCorrect = _checkIfAnswerIsCorrect(question, userResponse);
        if (!isAnswerCorrect) {
          return false; // not correct answer, i.e ineligible - abort immediately in case of general questions
        }
      }
    }

    return true;
  };

  // console.log({ responses });
  // Calculate overall eligibility based on current responses
  // const calculateOverallEligibility = () => {
  //   // First check general eligibility
  //   const generalEligible = calculateGeneralEligibility();
  //   if (!generalEligible) {
  //     return false; // Immediately ineligible
  //   }

  //   // Check if at least one product is eligible
  //   return productSections?.some((_, index) =>
  //     calculateProductEligibility(index)
  //   );
  // };

  const _showToastMessage = (
    description: string,
    variant: "default" | "destructive" = "default"
  ) => {
    if (variant === "destructive") {
      showErrorToast(description);
    } else {
      showSuccessToast(description);
    }
  };

  // Add function to restart general questions
  const _restartGeneralQuestions = () => {
    // Clear responses for all general questions
    const generalQuestions = questionsList?.generalQuestions || [];
    const updatedResponses = { ...responses };
    generalQuestions?.forEach((question: Question) => {
      delete updatedResponses[question?._id];
    });
    setResponses(updatedResponses);

    // Navigate back to first general question
    const firstGeneralStep = stepStructure?.findIndex(
      (step) => step?.type === "general"
    );
    if (firstGeneralStep !== -1) {
      setCurrentStep(firstGeneralStep);
    } else {
      // If no general questions found, go to intro
      setCurrentStep(0);
    }
  };

  const _handleNext = async () => {
    const currentQuestion = _getCurrentQuestion();
    const currentStepInfo = _getCurrentStepInfo();

    // Validate current question if it exists
    if (currentQuestion) {
      const currentValue = responses[currentQuestion?._id];

      // Validate required fields
      if (
        currentQuestion?.isRequired &&
        (!currentValue ||
          (Array.isArray(currentValue) && currentValue?.length === 0))
      ) {
        showErrorToast("Please answer this question before continuing.");
        return;
      }

      // Check for wrong answers in general questions
      if (
        currentStepInfo?.type === "general" &&
        currentQuestion?.hasCorrectOption
      ) {
        const isAnswerCorrect = _checkIfAnswerIsCorrect(
          currentQuestion,
          currentValue
        );

        if (!isAnswerCorrect) {
          // Set to general ineligible state instead of completely aborting
          // _showToastMessage(
          //   "Unfortunately, your answer makes you ineligible. You can restart the general questions to try again.",
          //   "destructive"
          // );
          setCurrentStep(-2); // Set to general ineligible state (-2 to distinguish from overall ineligible -1)
          return;
        }
      }

      // Check for wrong answers in product questions - check after each question
      if (
        currentStepInfo?.type === "productQuestion" &&
        currentQuestion?.hasCorrectOption
      ) {
        const isAnswerCorrect = _checkIfAnswerIsCorrect(
          currentQuestion,
          currentValue
        );

        if (!isAnswerCorrect && currentStepInfo?.productIndex !== undefined) {
          // Mark this product as ineligible immediately
          productSections[currentStepInfo.productIndex].isEligible = false;

          // Skip to the product result step for this product
          const productResultStep = stepStructure?.findIndex(
            (step) =>
              step?.type === "productResult" &&
              step?.productIndex === currentStepInfo.productIndex
          );

          if (productResultStep !== -1) {
            setCurrentStep(productResultStep);
            return;
          }
        }
      }

      // Handle file upload for QuestionType.File
      if (currentQuestion?.questionType === QuestionType.File) {
        const file = currentValue;
        if (file && file instanceof File) {
          try {
            setIsUploadingFile(true);
            setUploadProgress(0);
            setUploadFileName(file.name);
            setShowUploadPopup(true);
            setUploadError("");
            setUploadComplete(false);

            // Create folder prefix based on question type and id for better organization
            const questionType = currentQuestion?.questionType;
            const questionId = currentQuestion?._id;
            const folderPrefix = `questionnaire/${questionType}/${questionId}/`;

            // Upload file to AWS S3
            const uploadResult = await uploadImage(
              file,
              folderPrefix,
              (progress) => {
                console.log(`Upload progress: ${progress}%`);
                setUploadProgress(progress);
              }
            );

            if (uploadResult) {
              // Update response with the uploaded file information
              const fileResponse = {
                originalFile: file,
                uploadedUrl: uploadResult?.url,
                filename: uploadResult?.filename,
                contentType: uploadResult?.contentType,
                uploadedAt: new Date().toISOString(),
              };

              setResponses((prev) => ({
                ...prev,
                [currentQuestion?._id]: fileResponse,
              }));

              setUploadComplete(true);
              setUploadProgress(100);

              // Show success toast and keep popup visible for a moment
              showSuccessToast("File uploaded successfully!");

              // Auto-hide popup after 3 seconds
              setTimeout(() => {
                setShowUploadPopup(false);
                setUploadComplete(false);
                setUploadProgress(0);
                setUploadFileName("");
              }, 3000);
            } else {
              setUploadError("Failed to upload file. Please try again.");
              showErrorToast("Failed to upload file. Please try again.");
              return;
            }
          } catch (error) {
            console.error("File upload error:", error);
            setUploadError("Failed to upload file. Please try again.");
            showErrorToast("Failed to upload file. Please try again.");
            return;
          } finally {
            setIsUploadingFile(false);
          }
        } else if (file && typeof file === "object" && file?.uploadedUrl) {
          // File was already uploaded, continue
          console.log("File already uploaded:", file);
        } else if (!file && currentQuestion?.isRequired) {
          showErrorToast("Please select a file to upload.");
          return;
        }
      }
    }

    // Check if we're at the end of a product section to evaluate eligibility (for products that passed all questions)
    if (currentStepInfo?.type === "productQuestion") {
      const nextStepInfo = stepStructure?.[currentStep + 1];
      if (
        nextStepInfo?.type === "productResult" &&
        currentStepInfo?.productIndex !== undefined
      ) {
        // Calculate eligibility for this product only if it hasn't been marked as ineligible yet
        if (
          productSections[currentStepInfo?.productIndex]?.isEligible !== false
        ) {
          const isProductEligible = _calculateProductEligibility(
            currentStepInfo?.productIndex
          );

          // Update product eligibility status for the product
          productSections[currentStepInfo?.productIndex].isEligible =
            isProductEligible;
        }
      }
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete questionnaire
      _handleComplete();
    }
  };

  const _handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push(`/products/${productId}`);
    }
  };

  // Helper function to convert responses to QuestionnaireResponse format
  const _convertResponsesToQuestionnaireFormat = (
    questionsArray: Question[],
    responses: Record<string, any>,
    productId?: string
  ): QuestionnaireResponse[] => {
    return questionsArray
      .map((question) => {
        const answer = responses?.[question?._id];
        const isCorrect = question?.hasCorrectOption
          ? _checkIfAnswerIsCorrect(question, answer)
          : undefined;

        return {
          questionId: question?._id,
          questionText: question?.questionText || "",
          questionType: question?.questionType,
          answer,
          isCorrect,
          productId, // Include product ID for product-specific questions
        };
      })
      .filter(
        (response) => response.answer !== undefined && response.answer !== null
      );
  };

  const _handleComplete = () => {
    // Calculate final eligibility based on all responses
    const generalEligible = _calculateGeneralEligibility();

    // Prepare general responses for Redux
    const generalQuestions = questionsList?.generalQuestions || [];
    const generalResponses = _convertResponsesToQuestionnaireFormat(
      generalQuestions,
      responses
    );

    // Dispatch general eligibility to Redux
    dispatch(
      setGeneralEligibility({
        isEligible: generalEligible,
        responses: generalResponses,
      })
    );

    if (!generalEligible) {
      // Show general ineligible screen
      setCurrentStep(-2);
      return;
    }

    // Check which products are eligible and prepare data for Redux
    const eligibleProducts = productSections?.filter((section, index) => {
      // If already marked as ineligible, keep that status
      if (section?.isEligible === false) {
        return false;
      }
      // Otherwise, calculate eligibility
      const isEligible = _calculateProductEligibility(index);
      section.isEligible = isEligible;
      return isEligible;
    });

    // Dispatch product eligibilities to Redux
    productSections?.forEach((section, index) => {
      const productResponses = _convertResponsesToQuestionnaireFormat(
        section?.questions,
        responses,
        section?.productId?.split("_")?.[0] // Pass the actual product ID
      );
      const actualProductId = section.productId.split("_")[0]; // Extract actual product ID

      // Dispatch product responses to the top-level array
      if (productResponses.length > 0) {
        dispatch(addProductResponses(productResponses));
      }

      const productEligibilityData: ProductEligibility = {
        productId: actualProductId,
        productName: section.productName,
        isEligible: section.isEligible,
        responses: productResponses, // Keep responses in ProductEligibility for backward compatibility
        ineligibilityReason:
          section.isEligible === false
            ? "Failed questionnaire requirements"
            : undefined,
      };

      dispatch(setProductEligibility(productEligibilityData));
    });

    console.log("Eligible products:", eligibleProducts);

    if (eligibleProducts.length === 0) {
      // No products are eligible - show final ineligible screen
      setCurrentStep(-1);
      return;
    }

    // Complete questionnaire and prepare for checkout
    const totalQuestions =
      totalGeneralQuestions +
      productSections.reduce(
        (sum, section) => sum + section.questions.length,
        0
      );
    const totalAnswered = Object.keys(responses).length;

    dispatch(
      completeQuestionnaire({
        completedAt: new Date().toISOString(),
        totalQuestions,
        totalAnswered,
      })
    );

    // At least one product is eligible - proceed to checkout with eligible products only
    setIsNavigatingToCheckout(true);

    localStorage.setItem("lastConsultation", new Date().toISOString());

    // Create checkout params with only eligible products
    // const checkoutParams = new URLSearchParams({
    //   product: productId,
    //   dosage,
    //   duration,
    // });

    // // Add eligible related products if any (excluding the main product)
    // const eligibleRelatedProducts = eligibleProducts
    //   ?.map((section) => section?.productId?.split("_")[0]) // Extract actual product ID
    //   ?.filter((id) => id !== productId); // Exclude main product

    // if (eligibleRelatedProducts?.length > 0) {
    //   checkoutParams?.set(
    //     "relatedProducts",
    //     eligibleRelatedProducts?.join(",")
    //   );
    // }

    router.push(`/checkout`);
    // Reset loading state after navigation
    // setTimeout(() => {
    //   setIsNavigatingToCheckout(false);
    // }, 100);
    setIsNavigatingToCheckout(false);
  };

  const _updateResponse = (value: any) => {
    const currentQuestion = _getCurrentQuestion();
    if (currentQuestion) {
      setResponses((prev) => ({
        ...prev,
        [currentQuestion?._id]: value,
      }));
    }
  };

  // Handle navigating back to a specific product (restart from beginning)
  const _restartProduct = (productIndex: number) => {
    // Clear responses for this product
    const productSection = productSections[productIndex];
    if (productSection) {
      const updatedResponses = { ...responses };
      productSection.questions.forEach((question) => {
        delete updatedResponses[question._id];
      });
      setResponses(updatedResponses);

      // Reset product eligibility
      productSections[productIndex].isEligible = null;

      // Navigate to product intro
      const productIntroStep = stepStructure?.findIndex(
        (step) =>
          step?.type === "productIntro" && step?.productIndex === productIndex
      );
      if (productIntroStep !== -1) {
        setCurrentStep(productIntroStep);
      }
    }
  };

  // Handle continuing past an ineligible product
  const _handleContinueAfterIneligible = () => {
    const currentStepInfo = _getCurrentStepInfo();
    if (
      currentStepInfo?.type === "productResult" &&
      currentStepInfo?.productIndex !== undefined
    ) {
      // Find next product intro or go to final results
      const nextProductIndex = currentStepInfo?.productIndex + 1;
      if (nextProductIndex < productSections.length) {
        // Go to next product intro
        const nextProductIntroStep = stepStructure?.findIndex(
          (step) =>
            step?.type === "productIntro" &&
            step?.productIndex === nextProductIndex
        );
        if (nextProductIntroStep !== -1) {
          setCurrentStep(nextProductIntroStep);
        }
      } else {
        // No more products, go to final results or complete
        const finalResultsStep = stepStructure?.findIndex(
          (step) => step?.type === "finalResults"
        );
        if (finalResultsStep !== -1) {
          setCurrentStep(finalResultsStep);
        } else {
          // No final results step, complete the questionnaire
          _handleComplete();
        }
      }
    }
  };

  const _closeUploadPopup = () => {
    setShowUploadPopup(false);
    setUploadComplete(false);
    setUploadProgress(0);
    setUploadFileName("");
    setUploadError("");
  };

  useEffect(() => {
    if (questions) {
      _getAllQuestions();
    }
  }, [questions]);

  // console.log("2323", { questionsList, stepStructure, currentStep });

  return {
    currentStep,
    responses,
    totalSteps,
    progress,
    totalGeneralQuestions,
    totalActualQuestions,
    productSections,
    getCurrentQuestion: _getCurrentQuestion,
    getCurrentStepInfo: _getCurrentStepInfo,
    setCurrentStep,
    updateResponse: _updateResponse,
    handleNext: _handleNext,
    handleBack: _handleBack,
    handleContinueAfterIneligible: _handleContinueAfterIneligible,
    calculateProductEligibility: _calculateProductEligibility,
    calculateGeneralEligibility: _calculateGeneralEligibility,
    restartProduct: _restartProduct,
    restartGeneralQuestions: _restartGeneralQuestions,
    checkIfAnswerIsCorrect: _checkIfAnswerIsCorrect,
    isNavigatingToCheckout,
    isUploadingFile,
    uploadProgress,
    uploadFileName,
    showUploadPopup,
    uploadError,
    uploadComplete,
    closeUploadPopup: _closeUploadPopup,
  };
};

export default useQuestionnaire;
