import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, CheckCircle, Heart, Scale, Zap } from "lucide-react";
import HomePageHeroSection from "./Components/HomePageHeroSection";
import HomePageFeaturedProducts from "./Components/HomePageFeaturedProducts";
import HomePageFeaturedTreatment from "./Components/HomePageFeaturedTreatment";
import { howItWorks } from "@/configs/constants";
import { getHomePageData } from "@/utils/getHomePageData";

const DefaultHomePage = async () => {
  // const categories = [
  //   {
  //     id: "68778edf7db6aef7c6e2beed",
  //     name: "Supplements edited",
  //     icon: Scale,
  //     description: "Description for Supplements",
  //     color: "bg-blue-50 text-blue-600",
  //   },
  //   {
  //     id: "68778edf7db6aef7c6e2bef9",
  //     name: "Medications one",
  //     icon: Zap,
  //     description: "Prescription and over-the-counter medications",
  //     color: "bg-purple-50 text-purple-600",
  //   },
  //   {
  //     id: "6874c60a104d4af22a710d95",
  //     name: "Supplements",
  //     icon: Heart,
  //     description: "Description for Supplements",
  //     color: "bg-green-50 text-green-600",
  //   },
  // ];

  // const topProducts = [
  //   {
  //     id: "6874c60b104d4af22a710ded",
  //     name: "Health Tests Product 1",
  //     category: "Weight Loss",
  //     price: 299,
  //     rating: 4.8,
  //     description: "Detailed description for Health Tests Product 1",
  //   },
  //   {
  //     id: "6874c60b104d4af22a710e1f",
  //     name: "Health Tests Product 1",
  //     category: "Peptides",
  //     price: 199,
  //     rating: 4.9,
  //     description: "Detailed description for Health Tests Product 1",
  //   },
  //   {
  //     id: "6874c60b104d4af22a710dd9",
  //     name: "Medical Devices Product 1",
  //     category: "Wellness",
  //     price: 349,
  //     rating: 4.7,
  //     description: "Detailed description for Medical Devices Product 1",
  //   },
  // ];

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
      {/* <section className="py-16 bg-white">
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
      </section> */}

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
