"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Theme } from "@/types/theme";

interface EligibilityQuestionnaireProps {
  theme: Theme;
}

const EligibilityQuestionnaire = ({ theme }: EligibilityQuestionnaireProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const productId = searchParams.get("productId") || "";
  const dosage = searchParams.get("dosage") || "";
  const duration = searchParams.get("duration") || "";
  const relatedProducts = searchParams.get("relatedProducts") || "";

  const [currentStep, setCurrentStep] = useState(0); // 0 = intro, 1-5 = general questions, 6 = transition, 7+ = product questions
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isEligible, setIsEligible] = useState(true);
  const [ineligibleProducts, setIneligibleProducts] = useState<string[]>([]);

  // General health questions
  const generalQuestions = [
    {
      id: "age",
      title: "What is your age?",
      type: "number" as const,
      required: true,
      placeholder: "Enter your age",
      validation: (value: string) => {
        const age = parseInt(value);
        if (age < 18 || age > 80) {
          return "Age must be between 18 and 80 for this treatment";
        }
        return null;
      },
    },
    {
      id: "biological_sex",
      title: "What is your biological sex?",
      type: "radio" as const,
      required: true,
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
      ],
    },
    {
      id: "weight",
      title: "What is your current weight?",
      type: "number" as const,
      required: true,
      placeholder: "Enter weight in lbs",
      validation: (value: string) => {
        const weight = parseInt(value);
        return weight > 0 ? null : "Please enter a valid weight";
      },
    },
    {
      id: "medical_conditions",
      title: "Do you have any of the following medical conditions?",
      type: "checkbox" as const,
      required: false,
      options: [
        "Heart disease or cardiovascular issues",
        "Kidney disease",
        "Liver disease",
        "Thyroid disorders",
        "Eating disorders",
        "Mental health conditions requiring medication",
        "None of the above",
      ],
      validation: (value: string[]) => {
        if (
          value?.includes("Heart disease or cardiovascular issues") ||
          value?.includes("Kidney disease")
        ) {
          return "Based on your medical history, this treatment may not be suitable";
        }
        return null;
      },
    },
    {
      id: "current_medications",
      title: "Are you currently taking any medications?",
      type: "textarea" as const,
      required: false,
      placeholder: "List all current medications, supplements, and vitamins...",
    },
  ];

  // Product-specific questions for semaglutide
  const productQuestions = [
    {
      id: "weight_loss_goal",
      title: "What is your weight loss goal?",
      type: "select" as const,
      required: true,
      options: [
        { value: "5-10", label: "5-10 lbs" },
        { value: "10-20", label: "10-20 lbs" },
        { value: "20-30", label: "20-30 lbs" },
        { value: "30-50", label: "30-50 lbs" },
        { value: "50+", label: "50+ lbs" },
      ],
    },
    {
      id: "previous_weight_loss_medications",
      title: "Have you tried weight loss medications before?",
      type: "radio" as const,
      required: true,
      options: [
        { value: "no", label: "No, this is my first time" },
        {
          value: "yes-glp1",
          label: "Yes, GLP-1 medications (Ozempic, Wegovy, etc.)",
        },
        { value: "yes-other", label: "Yes, other weight loss medications" },
      ],
    },
    {
      id: "gastrointestinal_issues",
      title: "Do you experience any gastrointestinal issues?",
      type: "checkbox" as const,
      required: false,
      options: [
        "Frequent nausea",
        "Chronic diarrhea",
        "Severe constipation",
        "GERD/Acid reflux",
        "Gastroparesis",
        "None of the above",
      ],
      validation: (value: string[]) => {
        if (value?.includes("Gastroparesis")) {
          return "Gastroparesis is a contraindication for this medication";
        }
        return null;
      },
    },
  ];

  const totalGeneralQuestions = generalQuestions.length;
  const totalProductQuestions = productQuestions.length;
  const totalSteps = 1 + totalGeneralQuestions + 1 + totalProductQuestions; // intro + general + transition + product

  const getCurrentQuestion = () => {
    if (currentStep === 0) return null; // Intro step
    if (currentStep <= totalGeneralQuestions) {
      return generalQuestions[currentStep - 1];
    }
    if (currentStep === totalGeneralQuestions + 1) return null; // Transition step
    return productQuestions[currentStep - totalGeneralQuestions - 2];
  };

  // Calculate eligibility based on current responses
  const calculateEligibility = () => {
    // Check age eligibility
    const age = parseInt(responses.age);
    if (age && (age < 18 || age > 80)) {
      return false;
    }

    // Check medical conditions
    const medicalConditions = responses.medical_conditions || [];
    if (
      medicalConditions.includes("Heart disease or cardiovascular issues") ||
      medicalConditions.includes("Kidney disease")
    ) {
      return false;
    }

    // Check gastrointestinal issues
    const giIssues = responses.gastrointestinal_issues || [];
    if (giIssues.includes("Gastroparesis")) {
      return false;
    }

    return true;
  };

  const progress = (currentStep / (totalSteps - 1)) * 100;

  const showToast = (
    title: string,
    description: string,
    variant: "default" | "destructive" = "default"
  ) => {
    // Simple alert for now - could be replaced with a proper toast system
    alert(`${title}: ${description}`);
  };

  const handleNext = () => {
    const currentQuestion = getCurrentQuestion();

    if (currentQuestion) {
      const currentValue = responses[currentQuestion.id];

      // Validate required fields
      if (
        currentQuestion.required &&
        (!currentValue ||
          (Array.isArray(currentValue) && currentValue.length === 0))
      ) {
        showToast(
          "Required Field",
          "Please answer this question before continuing.",
          "destructive"
        );
        return;
      }

      // Run custom validation
      if (currentQuestion.validation && currentValue) {
        const error = currentQuestion.validation(currentValue);
        if (error) {
          showToast("Eligibility Issue", error, "destructive");
        }
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
    const finalEligibility = calculateEligibility();

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

    if (relatedProducts) {
      checkoutParams.append("relatedProducts", relatedProducts);
    }

    router.push(`/checkout?${checkoutParams.toString()}`);
  };

  const updateResponse = (value: any) => {
    const currentQuestion = getCurrentQuestion();
    if (currentQuestion) {
      setResponses((prev) => ({
        ...prev,
        [currentQuestion.id]: value,
      }));
    }
  };

  const renderQuestion = () => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return null;

    const currentValue = responses[currentQuestion.id];

    switch (currentQuestion.type) {
      case "number":
        return (
          <div>
            <Label htmlFor={currentQuestion.id} className="theme-text-primary">
              {currentQuestion.title}
            </Label>
            <Input
              id={currentQuestion.id}
              type="number"
              placeholder={currentQuestion.placeholder || ""}
              value={currentValue || ""}
              onChange={(e) => updateResponse(e.target.value)}
              className="mt-2"
            />
          </div>
        );

      case "radio":
        return (
          <div>
            <Label className="theme-text-primary">
              {currentQuestion.title}
            </Label>
            <RadioGroup
              value={currentValue || ""}
              onValueChange={updateResponse}
              className="mt-2"
            >
              {currentQuestion.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="theme-text-primary">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case "checkbox":
        return (
          <div>
            <Label className="theme-text-primary">
              {currentQuestion.title}
            </Label>
            <div className="mt-2 space-y-2">
              {currentQuestion.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={currentValue?.includes(option) || false}
                    onCheckedChange={(checked) => {
                      const newValue = currentValue || [];
                      if (checked) {
                        updateResponse([...newValue, option]);
                      } else {
                        updateResponse(
                          newValue.filter((item: string) => item !== option)
                        );
                      }
                    }}
                  />
                  <Label
                    htmlFor={option}
                    className="text-sm theme-text-primary"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case "select":
        return (
          <div>
            <Label className="theme-text-primary">
              {currentQuestion.title}
            </Label>
            <Select value={currentValue || ""} onValueChange={updateResponse}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {currentQuestion.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case "textarea":
        return (
          <div>
            <Label htmlFor={currentQuestion.id} className="theme-text-primary">
              {currentQuestion.title}
            </Label>
            <Textarea
              id={currentQuestion.id}
              placeholder={currentQuestion.placeholder || ""}
              value={currentValue || ""}
              onChange={(e) => updateResponse(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const renderStep = () => {
    // Ineligible screen
    if (currentStep === -1) {
      return (
        <div className="text-center space-y-6">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
          <div>
            <h1 className="text-2xl font-bold mb-2 theme-text-primary">
              Treatment Not Recommended
            </h1>
            <p className="theme-text-muted">
              Unfortunately, based on your responses, you're not eligible to
              purchase this treatment at this time.
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
    if (currentStep === 0) {
      return (
        <div className="text-center space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2 theme-text-primary">
              Medical Questionnaire
            </h1>
            <p className="theme-text-muted">
              Before we proceed, please answer a few general health-related
              questions to confirm your eligibility for this treatment.
            </p>
          </div>
          <Button onClick={handleNext} className="w-full">
            Start Questionnaire
          </Button>
        </div>
      );
    }

    // Transition between general and product questions
    if (currentStep === totalGeneralQuestions + 1) {
      return (
        <div className="text-center space-y-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <div>
            <h1 className="text-2xl font-bold mb-2 theme-text-primary">
              Great Progress!
            </h1>
            <p className="theme-text-muted">
              Now we'll ask you a few questions specific to{" "}
              {productId === "semaglutide"
                ? "Semaglutide"
                : "the product you've selected"}
              .
            </p>
          </div>
          <Button onClick={handleNext} className="w-full">
            Continue
          </Button>
        </div>
      );
    }

    // Question screen
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2 theme-text-primary">
            {currentStep <= totalGeneralQuestions
              ? "General Health Questions"
              : "Product-Specific Questions"}
          </h1>
          <p className="theme-text-muted">
            Please answer the following question to help us determine your
            eligibility.
          </p>
        </div>

        {renderQuestion()}
      </div>
    );
  };

  const getStepTitle = () => {
    if (currentStep === 0) return "Introduction";
    if (currentStep <= totalGeneralQuestions)
      return `General Question ${currentStep}`;
    if (currentStep === totalGeneralQuestions + 1) return "Transition";
    return `Product Question ${currentStep - totalGeneralQuestions - 1}`;
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
          </div>
        )}

        {/* Question Card */}
        <Card className="mb-8">
          <CardContent className="p-8">{renderStep()}</CardContent>
        </Card>

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

export default EligibilityQuestionnaire;
