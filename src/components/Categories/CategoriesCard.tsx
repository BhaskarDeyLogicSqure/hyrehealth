"use client";

import React, { useMemo } from "react";
import { CardContent } from "../ui/card";
import { Card } from "../ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CategoriesCard = ({ category }: { category: any }) => {
  const router = useRouter();

  const _handleCategoryClick = (categoryName: string) => {
    const categorySlug = categoryName.toLowerCase().replace(" ", "-");
    router.push(`/products?category=${categorySlug}`);
  };

  const _getRandomCategoryColor = () => {
    const colors = [
      "bg-blue-50 text-blue-600 border-blue-200",
      "bg-purple-50 text-purple-600 border-purple-200",
      "bg-green-50 text-green-600 border-green-200",
      "bg-red-50 text-red-600 border-red-200",
      "bg-orange-50 text-orange-600 border-orange-200",
      "bg-orange-50 text-orange-600 border-orange-200",
      "bg-indigo-50 text-indigo-600 border-indigo-200",
    ];
    return colors[Math.floor(Math?.random() * colors?.length)];
  };

  const categoryColor = useMemo(() => {
    return _getRandomCategoryColor();
  }, [category]);

  return (
    <Card
      key={category.id}
      className={`cursor-pointer hover:shadow-lg transition-all duration-300 border-2 ${categoryColor} hover:scale-105 theme-bg`}
      onClick={() => _handleCategoryClick(category?.name)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-lg ${categoryColor} flex items-center justify-center`}
          >
            <Image
              src={"https://placehold.co/36x36/png"}
              alt={category?.name}
              width={36}
              height={36}
            />
          </div>

          <span className="text-sm theme-text-muted theme-bg-muted px-2 py-1 rounded-full">
            {category?.statistics?.productCount
              ? category?.statistics?.productCount
              : 0}{" "}
            products
          </span>
        </div>

        <h3 className="text-xl font-semibold theme-text-primary mb-2">
          {category?.name}
        </h3>
        <p className="theme-text-muted text-sm leading-relaxed">
          {category?.description}
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
