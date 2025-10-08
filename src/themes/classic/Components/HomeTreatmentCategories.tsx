"use client";

import React from "react";
import CategoriesCard from "./CategoriesCard";

const HomeTreatmentCategories = ({
  featuredCategories,
}: {
  featuredCategories: any;
}) => {
  if (!featuredCategories?.length) return null;

  return (
    <>
      <section className="py-16 bg-white px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-bold text-gray-900 mb-4 text-3xl">
              Product Categories
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Discover personalized treatments across our specialized wellness
              categories, each backed by clinical research and physician
              oversight.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCategories?.map((category: any, index: number) => (
              <CategoriesCard
                key={category?._id}
                category={category}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeTreatmentCategories;
