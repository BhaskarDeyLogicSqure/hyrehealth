"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ShieldCheck } from "lucide-react";
import { Shield } from "lucide-react";
import { Package } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const FeatureDetails = () => {
  const { merchantData } = useSelector(
    (state: RootState) => state?.merchantReducer
  );

  const features = [
    {
      title: "Fast, Simple, Private",
      description:
        "Skip the hassle of traditional visits and start in minutes.",
      icon: Clock,
    },
    {
      title: "Licensed Providers",
      description:
        "Every consultation and prescription is reviewed by a real, licensed medical professional.",
      icon: Shield,
    },
    {
      title: "U.S. Based Pharmacies",
      description:
        "Orders are fulfilled by certified, state-licensed compounding pharmacies.",
      icon: Package,
    },
    {
      title: "Safe & Transparent",
      description:
        "You know who’s providing your care, where it’s coming from, and how it’s handled.",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Why Choose HealthPortal?
      </h2>
      <div className="grid md:grid-cols-4 gap-8">
        {features?.map((feature, index) => {
          const Icon = feature?.icon;
          return (
            <Card key={index} className="text-center">
              <CardHeader>
                <div
                  className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    backgroundColor:
                      merchantData?.customizeBranding?.brandColor,
                  }}
                >
                  <Icon
                    className="h-8 w-8 text-blue-600"
                    style={{
                      color: merchantData?.customizeBranding?.accentColor,
                    }}
                  />
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
