"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, Zap, Heart, Shield, Brain, Activity } from "lucide-react";

const CategoriesPage = () => {
  const router = useRouter();

  const categories = [
    {
      id: 1,
      name: "Weight Loss",
      icon: Scale,
      description:
        "Effective weight management solutions including GLP-1 medications",
      productCount: 8,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      id: 2,
      name: "Peptides",
      icon: Zap,
      description: "Advanced peptide therapies for recovery and performance",
      productCount: 12,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      id: 3,
      name: "Wellness",
      icon: Heart,
      description: "Comprehensive wellness and longevity support",
      productCount: 15,
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      id: 4,
      name: "Hormone Therapy",
      icon: Activity,
      description: "Hormone optimization and replacement therapy",
      productCount: 6,
      color: "bg-red-50 text-red-600 border-red-200",
    },
    {
      id: 5,
      name: "Immune Support",
      icon: Shield,
      description: "Boost your immune system with targeted treatments",
      productCount: 9,
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
    {
      id: 6,
      name: "Cognitive Enhancement",
      icon: Brain,
      description: "Mental clarity and cognitive performance optimization",
      productCount: 7,
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
  ];

  const handleCategoryClick = (categoryName: string) => {
    const categorySlug = categoryName.toLowerCase().replace(" ", "-");
    router.push(`/products?category=${categorySlug}`);
  };

  return (
    <div className="min-h-screen theme-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold theme-text-primary mb-2">
            Treatment Categories
          </h1>
          <p className="theme-text-muted">
            Choose a category to explore our specialized treatments
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className={`cursor-pointer hover:shadow-lg transition-all duration-300 border-2 ${category.color} hover:scale-105 theme-bg`}
              onClick={() => handleCategoryClick(category.name)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg ${
                      category.color.split(" ")[0]
                    } flex items-center justify-center`}
                  >
                    <category.icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm theme-text-muted theme-bg-muted px-2 py-1 rounded-full">
                    {category.productCount} products
                  </span>
                </div>

                <h3 className="text-xl font-semibold theme-text-primary mb-2">
                  {category.name}
                </h3>
                <p className="theme-text-muted text-sm leading-relaxed">
                  {category.description}
                </p>

                <div className="mt-4 pt-4 border-t theme-border">
                  <span className="text-sm font-medium theme-text-primary">
                    Explore treatments →
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
