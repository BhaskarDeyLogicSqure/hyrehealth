"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle, ArrowRight, Heart, Scale, Zap } from "lucide-react";

const DefaultHomePage = () => {
  const router = useRouter();

  const categories = [
    {
      id: "68778edf7db6aef7c6e2beed",
      name: "Supplements edited",
      icon: Scale,
      description: "Description for Supplements",
      color: "bg-blue-50 text-blue-600",
    },
    {
      id: "68778edf7db6aef7c6e2bef9",
      name: "Medications one",
      icon: Zap,
      description: "Prescription and over-the-counter medications",
      color: "bg-purple-50 text-purple-600",
    },
    {
      id: "6874c60a104d4af22a710d95",
      name: "Supplements",
      icon: Heart,
      description: "Description for Supplements",
      color: "bg-green-50 text-green-600",
    },
  ];

  const topProducts = [
    {
      id: "6874c60b104d4af22a710ded",
      name: "Health Tests Product 1",
      category: "Weight Loss",
      price: 299,
      rating: 4.8,
      description: "Detailed description for Health Tests Product 1",
    },
    {
      id: "6874c60b104d4af22a710e1f",
      name: "Health Tests Product 1",
      category: "Peptides",
      price: 199,
      rating: 4.9,
      description: "Detailed description for Health Tests Product 1",
    },
    {
      id: "6874c60b104d4af22a710dd9",
      name: "Medical Devices Product 1",
      category: "Wellness",
      price: 349,
      rating: 4.7,
      description: "Detailed description for Medical Devices Product 1",
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      text: "Lost 25 lbs in 3 months with excellent support throughout the process.",
      rating: 5,
    },
    {
      name: "Mike T.",
      text: "The consultation was thorough and the products are genuinely effective.",
      rating: 5,
    },
    {
      name: "Jennifer L.",
      text: "Professional service and noticeable results. Highly recommend!",
      rating: 5,
    },
  ];

  const handleCategoryClick = (categoryId: any) => {
    router.push(`/products?category=${categoryId}`);
  };

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const handleExploreClick = () => {
    router.push("/categories");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
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
            onClick={handleExploreClick}
          >
            Explore Treatments
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Treatment Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Treatment Categories
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
                onClick={() => handleCategoryClick(category?.id)}
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <category.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Featured Treatments
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {topProducts.map((product) => (
              <Card
                key={product.id}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="secondary">{product.category}</Badge>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600 ml-1">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      ${product.price}/mo
                    </span>
                    <Button onClick={() => handleProductClick(product.id)}>
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Choose Treatment",
                description:
                  "Browse our categories and select the right treatment for you",
              },
              {
                step: 2,
                title: "Complete Consultation",
                description:
                  "Answer health questions and speak with our medical team",
              },
              {
                step: 3,
                title: "Get Approved",
                description:
                  "Receive your personalized treatment plan and dosage",
              },
              {
                step: 4,
                title: "Start Treatment",
                description:
                  "Your medication is delivered monthly to your door",
              },
            ].map((item) => (
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
