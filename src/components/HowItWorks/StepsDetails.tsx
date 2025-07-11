import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  ArrowRight,
  UserCheck,
  MessageSquare,
  Shield,
  Package,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const StepsDetails = () => {
  const steps = [
    {
      step: 1,
      title: "Choose Your Treatment",
      description:
        "Browse our range of FDA-approved treatments and select the one that's right for you.",
      icon: UserCheck,
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
      icon: MessageSquare,
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
      icon: Shield,
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
      icon: Package,
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
      icon: Truck,
      details: [
        "Regular health check-ins",
        "Dosage adjustments",
        "24/7 support access",
      ],
    },
  ];

  return (
    <div className="space-y-8 mb-16">
      {steps?.map((step, index) => {
        const Icon = step?.icon;
        return (
          <Card key={step?.step} className="overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex items-center gap-4 md:flex-col md:text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <Badge className="bg-blue-600 hover:bg-blue-700">
                    Step {step?.step}
                  </Badge>
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {step?.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-lg">
                    {step?.description}
                  </p>
                  <ul className="space-y-2">
                    {step?.details?.map((detail, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {index < steps?.length - 1 && (
                  <div className="hidden md:flex items-center">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StepsDetails;
