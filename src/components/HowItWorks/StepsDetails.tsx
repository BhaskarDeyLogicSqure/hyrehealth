import React from "react";
import StepDetailsCard from "./StepDetailsCard";

const steps: Step[] = [
  {
    step: 1,
    title: "Choose Your Treatment",
    description:
      "Browse our range of FDA-approved treatments and select the one that's right for you.",
    icon: "UserCheck",
    details: [
      "Browse treatment categories",
      "Read detailed product information",
      "Compare options and pricing",
    ],
  },
  {
    step: 2,
    title: "Complete Health Assessment",
    description:
      "Answer a few questions about your health history and goals to ensure treatment safety.",
    icon: "MessageSquare",
    details: [
      "Quick 5-10 minute questionnaire",
      "Medical history review",
      "Goal setting and expectations",
    ],
  },
  {
    step: 3,
    title: "Doctor Review & Approval",
    description:
      "Our licensed physicians review your information and approve your personalized treatment plan.",
    icon: "Shield",
    details: [
      "Board-certified physician review",
      "Personalized dosage recommendations",
      "Safety checks and contraindications",
    ],
  },
  {
    step: 4,
    title: "Prescription & Delivery",
    description:
      "Your medication is prepared at our certified pharmacy and shipped directly to your door.",
    icon: "Package",
    details: [
      "Prepared at certified pharmacy",
      "Discreet packaging",
      "Temperature-controlled shipping",
    ],
  },
  {
    step: 5,
    title: "Ongoing Support",
    description:
      "Continue with regular check-ins and adjust your treatment as needed with physician guidance.",
    icon: "Truck",
    details: [
      "Regular health check-ins",
      "Dosage adjustments",
      "24/7 support access",
    ],
  },
];

export interface Step {
  step: number;
  title: string;
  description: string;
  icon: string;
  details: string[];
}

const StepsDetails = () => {
  return (
    <div className="space-y-8 mb-16">
      {steps?.map((step, index) => (
        <StepDetailsCard
          key={index}
          step={step}
          index={index}
          totalSteps={steps?.length || 0}
        />
      ))}
    </div>
  );
};

export default StepsDetails;
