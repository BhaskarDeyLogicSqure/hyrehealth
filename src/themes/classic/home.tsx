import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ArrowRight, 
  Play, 
  Scale, 
  Dna, 
  Zap, 
  Leaf, 
  Shield, 
  Brain,
  Star,
  Check,
  Quote,
  Truck,
  FlaskConical,
  Users,
  ShieldCheck
} from "lucide-react";
import React from "react";
import HomeHeroSection from "./Components/HomeHeroSection";
import HomeTrustBadges from "./Components/HomeTrustBadges";
import HomeTreatmentCategories from "./Components/HomeTreatmentCategories";
import HomeFeaturedTreatments from "./Components/HomeFeaturedTreatments";
import HomeHowItWorks from "./Components/HomeHowItWorks";
import HomePatientSuccessStrories from "./Components/HomePatientSuccessStrories";

const ModernHomePage = () => {
  return (
    <div className="min-h-screen theme-bg">
      {/* Hero Section */}
      <HomeHeroSection />


      {/* Treatment Categories Section */}
      <HomeTreatmentCategories />

      {/* Featured Treatments Section */}
      <HomeFeaturedTreatments />

      {/* How It Works Section */}
      <HomeHowItWorks />

      {/* Patient Success Stories Section */}
      <HomePatientSuccessStrories />

      {/* Trust Badges Section */}
      <HomeTrustBadges />
    </div>
  );
};

export default ModernHomePage;
