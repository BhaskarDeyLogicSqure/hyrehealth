import CategoriesCard from "@/themes/default/Components/CategoriesCard";
import { treatmentCategories } from "@/configs/constants";
import React from "react";

const ModernAboutPage = () => {
  return (
    <div className="min-h-screen theme-bg">
      <div className="container mx-auto px-4 py-12">
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
              {treatmentCategories?.map((category, index) => (
                <CategoriesCard
                  key={category?.id}
                  category={category}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernAboutPage;
