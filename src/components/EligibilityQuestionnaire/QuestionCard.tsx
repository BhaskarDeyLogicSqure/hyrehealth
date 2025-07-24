import React from "react";
import { Card, CardContent } from "../ui/card";
import { AlertTriangle, CheckCircle, XCircle, Package } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Select } from "../ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import {
  Question,
  QuestionnaireOption,
  QuestionType,
} from "@/types/questionnaire";

interface ProductSection {
  productId: string;
  productName: string;
  questions: Question[];
  isEligible: boolean | null;
}

interface QuestionCardProps {
  currentStep: number;
  responses: Record<string, any>;
  // productId: string;
  totalGeneralQuestions: number;
  // totalProductQuestions?: number;
  // currentQuestionIndex?: number;
  totalActualQuestions?: number;
  productSections?: ProductSection[];
  setCurrentStep: (step: number) => void;
  handleNext: () => void;
  // handleBack: () => void;
  getCurrentQuestion: () => Question;
  getCurrentStepInfo: () => any;
  updateResponse: (value: any) => void;
  handleContinueAfterIneligible?: () => void;
  restartProduct?: (productIndex: number) => void;
  restartGeneralQuestions?: () => void;
  // handleContinueAfterIneligible?: () => void;
}

const QuestionCard = ({
  currentStep,
  responses,
  // productId,
  totalGeneralQuestions,
  // totalProductQuestions = 0,
  // currentQuestionIndex = 0,
  totalActualQuestions = 0,
  productSections = [],
  setCurrentStep,
  handleNext,
  // handleBack,
  getCurrentQuestion,
  getCurrentStepInfo,
  updateResponse,
  handleContinueAfterIneligible,
  restartProduct,
  restartGeneralQuestions,
}: // handleContinueAfterIneligible,
QuestionCardProps) => {
  const router = useRouter();
  const currentStepInfo = getCurrentStepInfo();
  console.log("currentStepInfo", currentStepInfo);

  // Helper function to get step information for UI
  const _getStepDisplayInfo = () => {
    switch (currentStepInfo.type) {
      case "intro":
        return {
          title: "Medical Questionnaire",
          description:
            "Before we proceed, please answer a few health-related questions to confirm your eligibility for your selected treatments.",
          showProgress: false,
        };

      case "general":
        return {
          title: "General Health Questions",
          description:
            "Please answer the following question to help us determine your eligibility.",
          showProgress: true,
          questionNumber: (currentStepInfo?.questionIndex || 0) + 1,
          totalQuestions: totalGeneralQuestions,
        };

      case "transition":
        return {
          title: "Great Progress!",
          description: `Now we'll ask you specific questions for each of your selected products to ensure they're right for you.`,
          showProgress: false,
        };

      case "productIntro":
        const productName = currentStepInfo?.productName || "this product";
        return {
          title: `${productName} Questions`,
          description: `Let's evaluate your eligibility for ${productName}. Please answer the following questions honestly.`,
          showProgress: false,
          productName,
        };

      case "productQuestion":
        const currentProduct =
          productSections[currentStepInfo?.productIndex || 0];
        return {
          title: `${currentStepInfo.productName || "Product"} Questions`,
          description:
            "Please answer the following question to help us determine your eligibility for this product.",
          showProgress: true,
          questionNumber: (currentStepInfo?.questionIndex || 0) + 1,
          totalQuestions: currentProduct?.questions.length || 0,
          productName: currentStepInfo?.productName,
        };

      case "productResult":
        const resultProduct =
          productSections[currentStepInfo?.productIndex || 0];
        const isEligible = resultProduct?.isEligible;
        return {
          title: isEligible
            ? `${currentStepInfo?.productName} - Approved!`
            : `${currentStepInfo?.productName} - Not Recommended`,
          description: isEligible
            ? `Great news! You're eligible for ${currentStepInfo?.productName}.`
            : `Based on your responses, ${currentStepInfo.productName} is not recommended for you at this time.`,
          showProgress: false,
          productName: currentStepInfo?.productName,
          isEligible,
        };

      case "finalResults":
        const eligibleProducts = productSections?.filter(
          (section) => section.isEligible === true
        );
        const ineligibleProducts = productSections?.filter(
          (section) => section.isEligible === false
        );

        return {
          title:
            eligibleProducts?.length > 0
              ? "Eligibility Results"
              : "Not Eligible",
          description:
            eligibleProducts?.length > 0
              ? `You are eligible for ${eligibleProducts?.length} of ${productSections?.length} selected products.`
              : "Unfortunately, based on your responses, you are not eligible to purchase the selected treatments at this time.",
          showProgress: false,
          eligibleProducts,
          ineligibleProducts,
        };

      default:
        return {
          title: "Questionnaire",
          description: "Please complete the questionnaire.",
          showProgress: false,
        };
    }
  };

  const _renderQuestion = () => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return null;

    const currentValue = responses?.[currentQuestion?._id];

    switch (currentQuestion?.questionType) {
      case QuestionType.Number:
        return (
          <div>
            <Label
              htmlFor={currentQuestion?._id}
              className="theme-text-primary"
            >
              {currentQuestion?.questionText}
            </Label>
            <Input
              id={currentQuestion?._id}
              type="number"
              placeholder={currentQuestion?.helpText || ""}
              value={currentValue || ""}
              onChange={(e) => updateResponse(e.target.value)}
              className="mt-2"
            />
          </div>
        );

      case QuestionType.Radio:
        return (
          <div>
            <Label className="theme-text-primary">
              {currentQuestion?.questionText}
            </Label>
            <RadioGroup
              value={currentValue || ""}
              onValueChange={updateResponse}
              className="mt-2"
            >
              {currentQuestion?.options?.map((option: QuestionnaireOption) => {
                const optionValue =
                  typeof option === "string" ? option : option?._id;
                const optionLabel =
                  typeof option === "string" ? option : option?.label;

                return (
                  <div
                    key={optionValue}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem value={optionValue} id={optionValue} />
                    <Label htmlFor={optionValue} className="theme-text-primary">
                      {optionLabel}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        );

      case QuestionType.Checkbox:
        return (
          <div>
            <Label className="theme-text-primary">
              {currentQuestion?.questionText}
            </Label>
            <div className="mt-2 space-y-2">
              {currentQuestion?.options?.map((option: QuestionnaireOption) => {
                const optionValue =
                  typeof option === "string" ? option : option?._id;
                const optionLabel =
                  typeof option === "string" ? option : option?.label;

                return (
                  <div
                    key={optionValue}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={optionValue}
                      checked={currentValue?.includes(optionValue) || false}
                      onCheckedChange={(checked) => {
                        const newValue = currentValue || [];
                        if (checked) {
                          updateResponse([...newValue, optionValue]);
                        } else {
                          updateResponse(
                            newValue.filter(
                              (item: string) => item !== optionValue
                            )
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor={optionValue}
                      className="text-sm theme-text-primary"
                    >
                      {optionLabel}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case QuestionType.Select:
        return (
          <div>
            <Label className="theme-text-primary">
              {currentQuestion?.questionText}
            </Label>
            <Select value={currentValue || ""} onValueChange={updateResponse}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {currentQuestion?.options?.map(
                  (option: QuestionnaireOption) => {
                    const optionValue =
                      typeof option === "string" ? option : option?._id;
                    const optionLabel =
                      typeof option === "string" ? option : option?.label;

                    return (
                      <SelectItem key={optionValue} value={optionValue}>
                        {optionLabel}
                      </SelectItem>
                    );
                  }
                )}
              </SelectContent>
            </Select>
          </div>
        );

      case QuestionType.Text:
      case QuestionType.Textarea:
        return (
          <div>
            <Label
              htmlFor={currentQuestion?._id}
              className="theme-text-primary"
            >
              {currentQuestion?.questionText}
            </Label>
            <Textarea
              id={currentQuestion?._id}
              placeholder={currentQuestion?.helpText || ""}
              value={currentValue || ""}
              onChange={(e) => updateResponse(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>
        );

      case QuestionType.Dropdown:
        return (
          <div>
            <Label className="theme-text-primary">
              {currentQuestion?.questionText}
            </Label>
            <Select value={currentValue || ""} onValueChange={updateResponse}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {currentQuestion?.options?.map(
                  (option: QuestionnaireOption) => {
                    const optionValue =
                      typeof option === "string" ? option : option?._id;
                    const optionLabel =
                      typeof option === "string" ? option : option?.label;
                    return (
                      <SelectItem key={optionValue} value={optionValue}>
                        {optionLabel}
                      </SelectItem>
                    );
                  }
                )}
              </SelectContent>
            </Select>
          </div>
        );

      default:
        return null;
    }
  };

  const _renderStep = () => {
    const stepInfo = _getStepDisplayInfo();

    // General questions ineligible screen
    if (currentStep === -2) {
      return (
        <div className="text-center space-y-6">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
          <div>
            <h1 className="text-2xl font-bold mb-2 theme-text-primary">
              {/* General Questions - Not Eligible */}
              Not Eligible
            </h1>
            <p className="theme-text-muted">
              Based on your answers, you are not eligible to proceed with
              treatment at this time.
            </p>
            {/* <p className="text-sm theme-text-muted mt-2">
              You can restart the general questions to provide different
              answers, or explore other treatments.
            </p> */}
          </div>
          <div className="space-y-3 flex gap-2 items-baseline justify-center">
            <Button
              onClick={restartGeneralQuestions}
              variant="outline"
              className="flex-1"
            >
              Restart General Questions
            </Button>
            <Button onClick={() => router.push("/")} className="flex-1">
              Explore Other Treatment
            </Button>
          </div>
        </div>
      );
    }

    // Overall ineligible screen
    if (currentStep === -1) {
      return (
        <div className="text-center space-y-6">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
          <div>
            <h1 className="text-2xl font-bold mb-2 theme-text-primary">
              Not Eligible
            </h1>
            <p className="theme-text-muted">
              Unfortunately, based on your responses, you are not eligible to
              purchase the selected treatments at this time.
            </p>
          </div>
          <div className="space-y-3">
            <Button onClick={() => setCurrentStep(0)} variant="outline">
              Review Responses
            </Button>
            <Button onClick={() => router.push("/")} className="w-full">
              Explore Other Treatments
            </Button>
          </div>
        </div>
      );
    }

    // Introduction
    if (currentStepInfo?.type === "intro") {
      return (
        <div className="text-center space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2 theme-text-primary">
              {stepInfo.title}
            </h1>
            <p className="theme-text-muted">{stepInfo.description}</p>
            {totalActualQuestions > 0 && (
              <p className="text-sm theme-text-muted mt-2">
                This questionnaire has {totalActualQuestions} questions and
                should take about {Math.ceil(totalActualQuestions / 2)} minutes
                to complete.
              </p>
            )}
            {productSections?.length > 0 && (
              <div className="mt-4">
                <p className="text-sm theme-text-muted mb-2">
                  Selected products:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {productSections?.map((section) => (
                    <span
                      key={section.productId}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                    >
                      {section?.productName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button onClick={handleNext} className="w-full">
            Start Questionnaire
          </Button>
        </div>
      );
    }

    // Transition to products
    if (currentStepInfo?.type === "transition") {
      return (
        <div className="text-center space-y-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <div>
            <h1 className="text-2xl font-bold mb-2 theme-text-primary">
              {stepInfo?.title}
            </h1>
            <p className="theme-text-muted">{stepInfo?.description}</p>
            {productSections?.length > 0 && (
              <p className="text-sm theme-text-muted mt-2">
                We'll evaluate {productSections?.length} product
                {productSections?.length > 1 ? "s" : ""} for you.
              </p>
            )}
          </div>
          <Button onClick={handleNext} className="w-full">
            Continue to Product Questions
          </Button>
        </div>
      );
    }

    // Product introduction
    if (currentStepInfo?.type === "productIntro") {
      return (
        <div className="text-center space-y-6">
          <Package className="h-16 w-16 text-blue-500 mx-auto" />
          <div>
            <h1 className="text-2xl font-bold mb-2 theme-text-primary">
              {stepInfo?.title}
            </h1>
            <p className="theme-text-muted">{stepInfo?.description}</p>
            {currentStepInfo?.productIndex !== undefined && (
              <p className="text-sm theme-text-muted mt-2">
                Product {currentStepInfo?.productIndex + 1} of{" "}
                {productSections?.length}
              </p>
            )}
          </div>
          <Button onClick={handleNext} className="w-full">
            Start {stepInfo?.productName} Questions
          </Button>
        </div>
      );
    }

    // Product eligibility result
    if (currentStepInfo?.type === "productResult") {
      const isLastProduct =
        (currentStepInfo?.productIndex || 0) === productSections?.length - 1;

      return (
        <div className="text-center space-y-6">
          {stepInfo?.isEligible ? (
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          ) : (
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
          )}
          <div>
            <h1 className="text-2xl font-bold mb-2 theme-text-primary">
              {stepInfo?.title}
            </h1>
            <p className="theme-text-muted">{stepInfo?.description}</p>
          </div>

          {/* Show buttons for ineligible products */}
          {!stepInfo?.isEligible && (
            <div className="space-y-3">
              <Button
                onClick={() =>
                  restartProduct?.(currentStepInfo?.productIndex || 0)
                }
                variant="outline"
                className="w-full"
              >
                Restart {stepInfo?.productName} Questions
              </Button>

              {!isLastProduct && (
                <Button
                  onClick={handleContinueAfterIneligible || handleNext}
                  className="w-full"
                >
                  Continue to Next Product
                </Button>
              )}

              {isLastProduct && (
                <Button onClick={handleNext} className="w-full">
                  Complete & Review Results
                </Button>
              )}
            </div>
          )}
        </div>
      );
    }

    // Final results summary
    if (currentStepInfo?.type === "finalResults") {
      const eligibleProducts = stepInfo?.eligibleProducts || [];
      const ineligibleProducts = stepInfo?.ineligibleProducts || [];
      const hasEligibleProducts = eligibleProducts.length > 0;

      return (
        <div className="text-center space-y-6">
          {hasEligibleProducts ? (
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          ) : (
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
          )}
          <div>
            <h1 className="text-2xl font-bold mb-2 theme-text-primary">
              {stepInfo?.title}
            </h1>
            <p className="theme-text-muted">{stepInfo?.description}</p>
          </div>

          {/* Show eligible and ineligible products */}
          <div className="space-y-4">
            {eligibleProducts.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">
                  Eligible Products:
                </h3>
                <div className="space-y-1">
                  {eligibleProducts.map((product: any) => (
                    <div
                      key={product.productId}
                      className="flex items-center gap-2 text-green-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>{product.productName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {ineligibleProducts.length > 0 && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">
                  Not Recommended:
                </h3>
                <div className="space-y-1">
                  {ineligibleProducts.map((product: any) => (
                    <div
                      key={product.productId}
                      className="flex items-center gap-2 text-red-700"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>{product.productName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Question screen (general or product-specific)
    return (
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-bold theme-text-primary">
              {stepInfo?.title}
            </h1>
            {stepInfo?.showProgress && (
              <span className="text-sm theme-text-muted bg-gray-100 px-2 py-1 rounded">
                {stepInfo?.questionNumber} of {stepInfo?.totalQuestions}
              </span>
            )}
          </div>
          <p className="theme-text-muted">{stepInfo?.description}</p>
          {stepInfo?.productName &&
            currentStepInfo?.type === "productQuestion" && (
              <p className="text-sm theme-text-muted mt-1">
                Evaluating: {stepInfo?.productName}
              </p>
            )}
        </div>

        {_renderQuestion()}
      </div>
    );
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-8">{_renderStep()}</CardContent>
    </Card>
  );
};

export default QuestionCard;
