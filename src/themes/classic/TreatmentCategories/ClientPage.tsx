"use client";

import CustomPagination from "@/components/CustomPagination";
import DataNotFound from "@/components/DataNotFound";
import ThemeLoader from "@/components/ThemeLoader";
import useCategories from "@/hooks/useCategories";
import { Category } from "@/types/categories";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoriesCard from "../Components/CategoriesCard";
import TreatmentTitle from "../Components/TreatmentTitle";
import CategoryTreatmentCTA from "../Components/CategoryTreatmentCTA";

const TreatmentCategoriesClient = () => {
  const {
    categories,
    dataPayload,
    isCategoriesLoading,
    isCategoriesError,
    onPageChange,
    refetch,
  } = useCategories();

  return (
    <div className=" theme-bg">
      <TreatmentTitle />

      <div className="bg-white px-6 py-16 lg:px-8">
        {/* Categories Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(categories?.data) && categories?.data?.length > 0 ? (
              categories?.data?.map((category: Category, index: number) => (
                <CategoriesCard
                  key={category?._id}
                  category={category}
                  index={index}
                />
              ))
            ) : isCategoriesLoading ? (
              <div className="col-span-full">
                <ThemeLoader
                  type="categories"
                  variant="skeleton"
                  message="Loading treatment categories..."
                />
              </div>
            ) : isCategoriesError ? (
              <div className="col-span-full">
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 max-w-md w-full">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full">
                        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-red-800 dark:text-red-200">
                          Unable to Load Categories
                        </h3>
                        <p className="text-red-600 dark:text-red-300 text-sm">
                          We encountered an issue while loading the treatment
                          categories. Please check your connection and try
                          again.
                        </p>
                      </div>
                      <Button
                        onClick={() => refetch()}
                        variant="outline"
                        className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="col-span-full">
                <DataNotFound type="categories" />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Custom Pagination Component */}
      {categories?.total && dataPayload?.page && dataPayload?.limit ? (
        <div className="mt-8">
          <CustomPagination
            currentPage={dataPayload.page}
            totalItems={categories.total}
            itemsPerPage={dataPayload.limit}
            onPageChange={onPageChange}
            showInfo={true}
            maxVisiblePages={5}
          />
        </div>
      ) : null}

      <CategoryTreatmentCTA />
    </div>
  );
};

export default TreatmentCategoriesClient;
