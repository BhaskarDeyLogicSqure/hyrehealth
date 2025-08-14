import React from "react";
import CategoriesCard from "./CategoriesCard";

const HomePageFeaturedTreatment = ({
  featuredCategories,
}: {
  featuredCategories: any;
}) => {
  if (!featuredCategories?.length) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Treatment Categories
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredCategories?.map((category: any, index: number) => (
            <CategoriesCard
              key={category?._id}
              category={category}
              featuredCard={true}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePageFeaturedTreatment;
