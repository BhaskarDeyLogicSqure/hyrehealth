"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigationState } from "@/hooks/useNavigationState";
import ThemeLoader from "@/components/ThemeLoader";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const HomePageHeroSection = () => {
  const { merchantData } = useSelector(
    (state: RootState) => state?.merchantReducer
  );

  const { navigateWithLoading, isNavigatingTo } = useNavigationState();

  const _handleExploreClick = () => {
    navigateWithLoading("/categories");
  };

  const isLoading = isNavigatingTo("/categories");

  return (
    <section
      className="py-16 text-white"
      style={{
        background:
          merchantData?.customizeBranding?.brandColor &&
          merchantData?.customizeBranding?.accentColor
            ? `linear-gradient(90deg, ${merchantData?.customizeBranding?.brandColor} 0%, ${merchantData?.customizeBranding?.accentColor} 100%)`
            : undefined,
      }}
    >
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Your Health Journey Starts Here
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Personalized treatments with expert consultation
        </p>
        <Button
          size="lg"
          className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
          onClick={_handleExploreClick}
          disabled={isLoading}
          style={{
            color: merchantData?.customizeBranding?.accentColor,
          }}
        >
          {isLoading ? (
            <ThemeLoader
              type="inline"
              variant="simple"
              size="sm"
              message="Loading..."
              className="gap-2"
            />
          ) : (
            <>
              Explore Treatments
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </section>
  );
};

export default HomePageHeroSection;
