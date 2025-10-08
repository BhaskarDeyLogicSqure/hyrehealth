import React from "react";
import HomeHeroSection from "./Components/HomeHeroSection";
import HomeTrustBadges from "./Components/HomeTrustBadges";
import HomeTreatmentCategories from "./Components/HomeTreatmentCategories";
import HomeFeaturedTreatments from "./Components/HomeFeaturedTreatments";
import HomeHowItWorks from "./Components/HomeHowItWorks";
import HomePatientSuccessStrories from "./Components/HomePatientSuccessStrories";
import { getHomePageData } from "@/utils/getHomePageData";

const ModernHomePage = async () => {
  const { featuredCategories, featuredProducts, featuredTestimonials } =
    await getHomePageData();

  return (
    <div className="min-h-screen theme-bg">
      {/* Hero Section */}
      <HomeHeroSection />

      {/* Treatment Categories Section */}
      <HomeTreatmentCategories featuredCategories={featuredCategories} />

      {/* Featured Treatments Section */}
      <HomeFeaturedTreatments featuredProducts={featuredProducts} />

      {/* How It Works Section */}
      <HomeHowItWorks />

      {/* Patient Success Stories Section */}
      <HomePatientSuccessStrories testimonials={featuredTestimonials} />

      {/* Trust Badges Section */}
      <HomeTrustBadges />
    </div>
  );
};

export default ModernHomePage;
