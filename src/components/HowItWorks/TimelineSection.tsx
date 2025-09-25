"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const TimelineSection = () => {
  const { merchantData } = useSelector(
    (state: RootState) => state?.merchantReducer
  );

  return (
    <Card className="bg-blue-50 border-blue-200 mb-16">
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          Expected Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div
              className="text-3xl font-bold text-blue-600 mb-2"
              style={{
                color: merchantData?.customizeBranding?.brandColor,
              }}
            >
              5-10 min
            </div>
            <p className="text-gray-700">Health Assessment</p>
          </div>
          <div>
            <div
              className="text-3xl font-bold text-blue-600 mb-2"
              style={{
                color: merchantData?.customizeBranding?.brandColor,
              }}
            >
              24-48 hrs
            </div>
            <p className="text-gray-700">Physician Review</p>
          </div>
          <div>
            <div
              className="text-3xl font-bold text-blue-600 mb-2"
              style={{
                color: merchantData?.customizeBranding?.brandColor,
              }}
            >
              1-2 days
            </div>
            <p className="text-gray-700">Prescription Processing</p>
          </div>
          <div>
            <div
              className="text-3xl font-bold text-blue-600 mb-2"
              style={{
                color: merchantData?.customizeBranding?.brandColor,
              }}
            >
              2-5 days
            </div>
            <p className="text-gray-700">Delivery</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineSection;
