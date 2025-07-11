import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Shield } from "lucide-react";
import { Package } from "lucide-react";

const FeatureDetails = () => {
  const features = [
    {
      title: "Fast & Convenient",
      description:
        "Get started in minutes, no waiting rooms or appointments needed",
      icon: Clock,
    },
    {
      title: "Licensed Physicians",
      description:
        "All treatments reviewed and approved by board-certified doctors",
      icon: Shield,
    },
    {
      title: "Discreet Delivery",
      description: "Your privacy is protected with secure, unmarked packaging",
      icon: Package,
    },
  ];

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Why Choose HealthPortal?
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {features?.map((feature, index) => {
          const Icon = feature?.icon;
          return (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{feature?.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature?.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureDetails;
