import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, CheckCircle, Heart, Scale, Zap } from "lucide-react";
import HomePageHeroSection from "./Components/HomePageHeroSection";
import HomePageFeaturedProducts from "./Components/HomePageFeaturedProducts";
import HomePageFeaturedTreatment from "./Components/HomePageFeaturedTreatment";
import { howItWorks } from "@/configs/constants";
import { getHomePageData } from "@/utils/getHomePageData";

const DefaultHomePage = async () => {
  const testimonials = [
    {
      rating: 5,
      text: "I've been using this product for a month now and it's been amazing. I've seen a significant improvement in my skin.",
      name: "John Doe",
    },
    {
      rating: 5,
      text: "I've been using this product for a month now and it's been amazing. I've seen a significant improvement in my skin.",
      name: "John Doe",
    },
    {
      rating: 5,
      text: "I've been using this product for a month now and it's been amazing. I've seen a significant improvement in my skin.",
      name: "John Doe",
    },
  ];

  const { featuredCategories, featuredProducts } = await getHomePageData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HomePageHeroSection />

      {/* Treatment Categories */}
      <HomePageFeaturedTreatment featuredCategories={featuredCategories} />

      {/* Top Products */}
      <HomePageFeaturedProducts featuredProducts={featuredProducts} />

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks?.map((item: any) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Patients Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                  <p className="font-semibold">— {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
              <span className="text-gray-700">FDA Approved</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              <span className="text-gray-700">Free Shipping</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DefaultHomePage;
