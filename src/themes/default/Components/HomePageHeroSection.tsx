"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const HomePageHeroSection = () => {
  const router = useRouter();

  const _handleExploreClick = () => {
    router.push("/categories");
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
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
        >
          Explore Treatments
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
};

export default HomePageHeroSection;
