"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Play } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";

const HomeHeroSection = () => {
  const { merchantData } = useSelector(
    (state: RootState) => state?.merchantReducer
  );

  const router = useRouter();

  return (
    <>
      <section
        className="py-20 px-8"
        style={{
          background:
            merchantData?.customizeBranding?.brandColor &&
            merchantData?.customizeBranding?.accentColor
              ? `linear-gradient(90deg, ${merchantData?.customizeBranding?.brandColor}20 0%, ${merchantData?.customizeBranding?.accentColor}20 100%)`
              : "linear-gradient(90deg, #e0f2fe20 0%, #b3e5fc20 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="font-bold text-gray-900 mb-8 text-left leading-tight text-6xl">
            Your Performance Journey
            <br />
            Starts Here
          </h1>
          <p className="text-gray-600 mb-10 text-xl text-left max-w-3xl leading-relaxed">
            Access premium peptides and GLPs through our team of licensed
            physicians, fast, private, and simple.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-10">
            <Button
              className="text-white h-12 px-6 text-sm rounded-md w-full sm:w-auto font-semibold hover:brightness-95"
              style={{
                backgroundColor:
                  merchantData?.customizeBranding?.accentColor || "#1e40af",
                borderColor:
                  merchantData?.customizeBranding?.accentColor || "#1e40af",
              }}
              onClick={() => {
                router.push("/categories");
              }}
            >
              Explore Treatments
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="text-gray-900 border-gray-900 h-12 px-6 text-sm rounded-md w-full sm:w-auto font-semibold hover:brightness-95"
              style={{
                borderColor:
                  merchantData?.customizeBranding?.accentColor || "#1e40af",
                color:
                  merchantData?.customizeBranding?.accentColor || "#1e40af",
              }}
              onClick={() => {
                router.push("/how-it-works");
              }}
            >
              <Play className="mr-2 w-4 h-4" />
              How It Works
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row items-start gap-6 text-base text-gray-700">
            <div className="flex items-center  text-sm">
              <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
              Licensed Physicians
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
              FDA-Approved Treatments
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
              HIPAA Compliant
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeHeroSection;
