import React from "react";
import { CheckCircle } from "lucide-react";
import HomePageHeroSection from "./Components/HomePageHeroSection";
import HomePageFeaturedProducts from "./Components/HomePageFeaturedProducts";
import HomePageFeaturedTreatment from "./Components/HomePageFeaturedTreatment";
import HomePageTestimonials from "./Components/HomePageTestimonials";
import HomePageHowItWorksSection from "./Components/HomePageHowItWorksSection";

interface DefaultHomePageProps {
  featuredCategories: any[];
  featuredProducts: any[];
  featuredTestimonials: any[];
}

const DefaultHomePage = ({
  featuredCategories,
  featuredProducts,
  featuredTestimonials,
}: DefaultHomePageProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HomePageHeroSection />

      {/* Treatment Categories */}
      <HomePageFeaturedTreatment featuredCategories={featuredCategories} />

      {/* Top Products */}
      <HomePageFeaturedProducts featuredProducts={featuredProducts} />

      {/* How It Works */}
      <HomePageHowItWorksSection />

      {/* Testimonials */}
      <HomePageTestimonials testimonials={featuredTestimonials} />

      {/* Trust Banner */}
      <section className="bg-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 text-center">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              <span className="text-gray-700">HIPAA Compliant</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              <span className="text-gray-700">Licensed Physicians</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              <span className="text-gray-700">USA Manufactured</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              <span className="text-gray-700">Fast Fulfillment</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              <span className="text-gray-700">Secure Payments</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DefaultHomePage;
