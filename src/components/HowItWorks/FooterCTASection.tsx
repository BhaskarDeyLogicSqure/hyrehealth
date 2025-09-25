"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const FooterCTASection = () => {
  const router = useRouter();
  const { merchantData } = useSelector(
    (state: RootState) => state?.merchantReducer
  );

  return (
    <Card
      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white"
      style={{
        background:
          merchantData?.customizeBranding?.brandColor &&
          merchantData?.customizeBranding?.accentColor
            ? `linear-gradient(90deg, ${merchantData?.customizeBranding?.brandColor} 0%, ${merchantData?.customizeBranding?.accentColor} 100%)`
            : undefined,
      }}
    >
      <CardContent className="text-center py-12">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-8 text-blue-100">
          Join thousands of patients who trust HealthPortal for their health
          needs
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            size="lg"
            className="border-white bg-white"
            onClick={() => router.push("/products")}
            style={{
              color: merchantData?.customizeBranding?.accentColor,
              borderColor: merchantData?.customizeBranding?.accentColor,
              backgroundColor: "white",
            }}
            onMouseEnter={(e) => {
              if (merchantData?.customizeBranding?.accentColor) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  merchantData?.customizeBranding?.accentColor;
                (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  merchantData?.customizeBranding?.accentColor;
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "white";
              (e.currentTarget as HTMLButtonElement).style.color =
                merchantData?.customizeBranding?.accentColor || "";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                merchantData?.customizeBranding?.accentColor || "";
            }}
          >
            Browse Treatments
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white bg-white"
            onClick={() => router.push("/support")}
            style={{
              color: merchantData?.customizeBranding?.accentColor,
              borderColor: merchantData?.customizeBranding?.accentColor,
            }}
            onMouseEnter={(e) => {
              if (merchantData?.customizeBranding?.accentColor) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  merchantData?.customizeBranding?.accentColor;
                (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  merchantData?.customizeBranding?.accentColor;
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "white";
              (e.currentTarget as HTMLButtonElement).style.color =
                merchantData?.customizeBranding?.accentColor || "";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                merchantData?.customizeBranding?.accentColor || "";
            }}
          >
            Have Questions?
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FooterCTASection;
