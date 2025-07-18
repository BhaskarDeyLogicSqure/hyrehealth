"use client";

import CategoriesCard from "@/components/Categories/CategoriesCard";
import CustomPagination from "@/components/CustomPagination";
import DataNotFound from "@/components/DataNotFound";
import ThemeLoader from "@/components/ThemeLoader";
import useCategories from "@/hooks/useCategories";
import { Category } from "@/types/categories";

const TreatmentCategoriesClient = () => {
  const {
    categories,
    dataPayload,
    isCategoriesLoading,
    isCategoriesError,
    onPageChange,
  } = useCategories();

  return (
    <div className="min-h-screen theme-bg">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold theme-text-primary mb-2">
          Treatment Categories
        </h1>
        <p className="theme-text-muted mb-6">
          Choose a category to explore our specialized treatments
        </p>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(categories?.data) && categories?.data?.length > 0 ? (
            categories?.data?.map((category: Category) => (
              <CategoriesCard key={category?._id} category={category} />
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
            <div className="col-span-full text-center py-8">
              <p className="text-2xl font-bold text-red-600">
                Error loading categories
              </p>
              <p className="text-gray-600 mt-2">Please try again later</p>
            </div>
          ) : (
            <div className="col-span-full">
              <DataNotFound type="categories" />
            </div>
          )}
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
      </div>
    </div>
  );
};

export default TreatmentCategoriesClient;
