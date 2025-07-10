"use client";

import React from "react";
import { CardContent } from "../ui/card";
import { Scale, Zap, Heart, Shield, Brain, Activity } from "lucide-react";

import { Card } from "../ui/card";

import { useRouter } from "next/navigation";

const CategoriesCard = ({ category }: { category: any }) => {
  const router = useRouter();

  const _handleCategoryClick = (categoryName: string) => {
    const categorySlug = categoryName.toLowerCase().replace(" ", "-");
    router.push(`/products?category=${categorySlug}`);
  };

  const _getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case "Weight Loss":
        return <Scale className="h-6 w-6" />;
      case "Peptides":
        return <Zap className="h-6 w-6" />;
      case "Wellness":
        return <Heart className="h-6 w-6" />;
      case "Hormone Therapy":
        return <Shield className="h-6 w-6" />;
      case "Immune Support":
        return <Shield className="h-6 w-6" />;
      case "Cognitive Enhancement":
        return <Brain className="h-6 w-6" />;
      default:
        return null;
    }
  };

  return (
    <Card
      key={category.id}
      className={`cursor-pointer hover:shadow-lg transition-all duration-300 border-2 ${category.color} hover:scale-105 theme-bg`}
      onClick={() => _handleCategoryClick(category.name)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-lg ${
              category.color.split(" ")[0]
            } flex items-center justify-center`}
          >
            {_getCategoryIcon(category?.name)}
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
  );
};

export default CategoriesCard;
