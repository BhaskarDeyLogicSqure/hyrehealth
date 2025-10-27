import React from "react";
import HomeHeroSection from "./Components/HomeHeroSection";
import HomeTrustBadges from "./Components/HomeTrustBadges";
import HomeTreatmentCategories from "./Components/HomeTreatmentCategories";
import HomeFeaturedTreatments from "./Components/HomeFeaturedTreatments";
import HomeHowItWorks from "./Components/HomeHowItWorks";
import HomePatientSuccessStrories from "./Components/HomePatientSuccessStrories";

interface ModernHomePageProps {
  featuredCategories: any[];
  featuredProducts: any[];
  featuredTestimonials: any[];
}

const ModernHomePage = ({
  featuredCategories,
  featuredProducts,
  featuredTestimonials,
}: ModernHomePageProps) => {
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
