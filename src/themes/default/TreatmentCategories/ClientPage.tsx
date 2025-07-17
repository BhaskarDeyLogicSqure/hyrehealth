"use client";

import CategoriesCard from "@/components/Categories/CategoriesCard";
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

        <h2 className="text-lg font-bold theme-text-primary mb-2">
          Total: {categories?.total}
        </h2>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(categories?.data) && categories?.data?.length > 0 ? (
            categories?.data?.map((category: Category) => (
              <CategoriesCard key={category?._id} category={category} />
            ))
          ) : isCategoriesLoading ? (
            <div className="col-span-full text-center py-8">
              <p className="text-2xl font-bold">Loading...</p>
            </div>
          ) : isCategoriesError ? (
            <div className="col-span-full text-center py-8">
              <p className="text-2xl font-bold text-red-600">
                Error loading categories
              </p>
              <p className="text-gray-600 mt-2">Please try again later</p>
            </div>
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-2xl font-bold">No categories found</p>
              {dataPayload?.search && (
                <p className="text-gray-600 mt-2">
                  Try adjusting your search or filters
                </p>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {categories?.total > categories?.data?.length && (
          <div className="mt-8 flex justify-center items-center space-x-2">
            <button
              onClick={() => onPageChange(Math.max(1, dataPayload?.page! - 1))}
              disabled={dataPayload?.page === 1}
              className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <span className="px-4 py-2">
              Page {dataPayload?.page} of{" "}
              {Math.ceil(categories?.total / dataPayload?.limit)}
            </span>

            <button
              onClick={() =>
                onPageChange(
                  Math.min(
                    Math.ceil(categories?.total / dataPayload?.limit),
                    dataPayload?.page! + 1
                  )
                )
              }
              disabled={
                dataPayload?.page ===
                Math.ceil(categories?.total / dataPayload?.limit)
              }
              className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreatmentCategoriesClient;
