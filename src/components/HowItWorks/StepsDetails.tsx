import React from "react";
import StepDetailsCard from "./StepDetailsCard";

export interface Step {
  step: number;
  title: string;
  description?: string;
  icon: string;
  details: string[];
}

const steps: Step[] = [
  {
    step: 1,
    title: "Take Control of Your Wellness Journey",
    // description:
    //   "Browse our range of FDA-approved treatments and select the one that's right for you.",
    icon: "UserCheck",
    details: [
      "No waiting rooms.",
      "No confusing processes.",
      "Use your preferred device to select your ideal products through our simple, secure platform.",
    ],
  },
  {
    step: 2,
    title: "Complete a Quick Online Consultation",
    // description:
    //   "Answer a few questions about your health history and goals to ensure treatment safety.",
    icon: "MessageSquare",
    details: [
      "Answer a few questions about your goals, things like energy, focus, or weight management.",
      "The process takes seconds and helps our system match you with the right licensed provider.",
    ],
  },
  {
    step: 3,
    title: "Provider Review & Approval",
    // description:
    //   "Our licensed physicians review your information and approve your personalized treatment plan.",
    icon: "Shield",
    details: [
      "A licensed medical professional reviews your info and determines if peptide or GLP therapy is appropriate for you.",
      "Once approved, your personalized plan is confirmed and fulfilled through an authorized US pharmacy.",
    ],
  },
  {
    step: 4,
    title: "Discreet Delivery, Real Results",
    // description:
    //   "Your medication is prepared at our certified pharmacy and shipped directly to your door.",
    icon: "Package",
    details: [
      "Your products ship directly to you in secure, discreet packaging.",
      "You’ll also receive clear usage instructions and access to ongoing 24/7 support within your own customer dashboard.",
    ],
  },
];

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
