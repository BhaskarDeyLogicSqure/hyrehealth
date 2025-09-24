"use client";

import React from "react";
import { howItWorks } from "@/configs/constants";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const HomePageHowItWorksSection = () => {
  const { merchantData } = useSelector(
    (state: RootState) => state?.merchantReducer
  );

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {howItWorks?.map((item: any) => (
            <div key={item?.step} className="text-center">
              <div
                className={`w-12 h-12 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold`}
                style={{
                  backgroundColor: merchantData?.customizeBranding?.accentColor,
                }}
              >
                {item?.step}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item?.title}</h3>
              <p className="text-gray-600 text-sm">{item?.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePageHowItWorksSection;
