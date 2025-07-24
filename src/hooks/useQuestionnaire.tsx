import { Question } from "@/types/questionnaire";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { showToast, errorToast } from "@/utils/toasters";

interface ProductSection {
  productId: string;
  productName: string;
  questions: Question[];
  isEligible: boolean | null; // null = not evaluated yet, true = eligible, false = ineligible
}

const useQuestionnaire = (
  questions: Record<string, any>,
  productId: string,
  dosage: string,
  duration: string
) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [questionsList, setQuestionsList] = useState<Record<string, any>>({});
  // const [currentProductIndex, setCurrentProductIndex] = useState(0);

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

  console.log("productSections", productSections);

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
  // 5. Final completion (handled separately)

  const stepStructure = useMemo(() => {
    const structure: Array<{
      type:
        | "intro"
        | "general"
        | "transition"
        | "productIntro"
        | "productQuestion"
        | "productResult";
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

  const getCurrentQuestion = () => {
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
  const getCurrentStepInfo = () => {
    return stepStructure[currentStep] || { type: "intro" };
  };

  // Calculate eligibility for a specific product based on current responses
  const calculateProductEligibility = (productIndex: number) => {
    // This is a placeholder - implement your actual eligibility logic here
    // You might want to check specific responses for each product

    // Example eligibility checks (customize based on your requirements)
    const age = parseInt(responses.age);
    if (age && (age < 18 || age > 80)) {
      return false;
    }

    const medicalConditions = responses.medical_conditions || [];
    if (
      medicalConditions.includes("Heart disease or cardiovascular issues") ||
      medicalConditions.includes("Kidney disease")
    ) {
      return false;
    }

    const giIssues = responses.gastrointestinal_issues || [];
    if (giIssues.includes("Gastroparesis")) {
      return false;
    }

    // Add product-specific eligibility logic here
    // You can check product-specific questions and responses

    return true;
  };

  // Calculate overall eligibility based on current responses
  const calculateOverallEligibility = () => {
    return calculateProductEligibility(0); // Use general eligibility for now
  };

  const showToastMessage = (
    title: string,
    description: string,
    variant: "default" | "destructive" = "default"
  ) => {
    if (variant === "destructive") {
      errorToast(description);
    } else {
      showToast({ message: description, type: "success" });
    }
  };

  const handleNext = () => {
    const currentQuestion = getCurrentQuestion();
    const currentStepInfo = getCurrentStepInfo();

    // Validate current question if it exists
    if (currentQuestion) {
      const currentValue = responses[currentQuestion?._id];

      // Validate required fields
      if (
        currentQuestion?.isRequired &&
        (!currentValue ||
          (Array.isArray(currentValue) && currentValue?.length === 0))
      ) {
        showToastMessage(
          "Required Field",
          "Please answer this question before continuing.",
          "destructive"
        );
        return;
      }
    }

    // Check if we're at the end of a product section to evaluate eligibility
    if (currentStepInfo.type === "productQuestion") {
      const nextStepInfo = stepStructure[currentStep + 1];
      if (
        nextStepInfo?.type === "productResult" &&
        currentStepInfo.productIndex !== undefined
      ) {
        // Calculate eligibility for this product
        const isEligible = calculateProductEligibility(
          currentStepInfo.productIndex
        );

        // Update product eligibility status
        productSections[currentStepInfo.productIndex].isEligible = isEligible;
      }
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete questionnaire
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push(`/products/${productId}`);
    }
  };

  const handleComplete = () => {
    // Calculate final eligibility based on all responses
    const finalEligibility = calculateOverallEligibility();

    if (!finalEligibility) {
      // Show ineligible screen
      setCurrentStep(-1);
      return;
    }

    // Save consultation status and proceed to checkout
    localStorage.setItem("lastConsultation", new Date().toISOString());

    const checkoutParams = new URLSearchParams({
      product: productId,
      dosage,
      duration,
    });

    router.push(`/checkout?${checkoutParams.toString()}`);
  };

  const updateResponse = (value: any) => {
    const currentQuestion = getCurrentQuestion();
    if (currentQuestion) {
      setResponses((prev) => ({
        ...prev,
        [currentQuestion?._id]: value,
      }));
    }
  };

  // Handle continuing past an ineligible product
  const handleContinueAfterIneligible = () => {
    const currentStepInfo = getCurrentStepInfo();
    if (
      currentStepInfo.type === "productResult" &&
      currentStepInfo.productIndex !== undefined
    ) {
      // Find next product intro or completion
      const nextProductIndex = currentStepInfo.productIndex + 1;
      if (nextProductIndex < productSections.length) {
        // Go to next product intro
        const nextProductIntroStep = stepStructure.findIndex(
          (step) =>
            step.type === "productIntro" &&
            step.productIndex === nextProductIndex
        );
        if (nextProductIntroStep !== -1) {
          setCurrentStep(nextProductIntroStep);
        }
      } else {
        // No more products, complete the questionnaire
        handleComplete();
      }
    }
  };

  useEffect(() => {
    if (questions) {
      _getAllQuestions();
    }
  }, [questions]);

  console.log("2323", { questionsList, stepStructure, currentStep });

  return {
    currentStep,
    responses,
    // questionsList,
    // currentQuestionIndex,
    totalSteps,
    progress,
    totalGeneralQuestions,
    // totalProductQuestions: productSections.reduce(
    //   (sum, section) => sum + section.questions.length,
    //   0
    // ),
    totalActualQuestions,
    productSections,
    getCurrentQuestion,
    getCurrentStepInfo,
    setCurrentStep,
    updateResponse,
    handleNext,
    handleBack,
    // handleContinueAfterIneligible,
    calculateProductEligibility,
  };
};

export default useQuestionnaire;
