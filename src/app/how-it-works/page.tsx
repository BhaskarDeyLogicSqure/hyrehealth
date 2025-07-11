import StepsDetails from "@/components/HowItWorks/StepsDetails";
import FeatureDetails from "@/components/HowItWorks/FeatureDetails";
import FooterCTASection from "@/components/HowItWorks/FooterCTASection";
import TimelineSection from "@/components/HowItWorks/TimelineSection";

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How HealthPortal Works
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get personalized healthcare treatments delivered to your door in 5
            simple steps. Our licensed physicians ensure safe, effective care
            tailored to your needs.
          </p>
        </div>

        {/* Steps Section */}
        <StepsDetails />

        {/* Features Section */}
        <FeatureDetails />

        {/* Timeline Section */}
        <TimelineSection />

        {/* CTA Section */}
        <FooterCTASection />
      </div>
    </div>
  );
};

export default HowItWorksPage;
