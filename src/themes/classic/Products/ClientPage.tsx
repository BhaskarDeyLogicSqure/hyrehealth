"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, ArrowUpDown, RotateCcw } from "lucide-react";
import { Product } from "@/types/products";
import { Category } from "@/types/categories";
import useProducts from "@/hooks/useProducts";
import CustomPagination from "@/components/CustomPagination";
import DataNotFound from "@/components/DataNotFound";
import ThemeLoader from "@/components/ThemeLoader";
import { PRODUCT_SORT_OPTIONS } from "@/configs";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import ProductsCard from "../Components/ProductsCard";
import ProductsTitle from "../Components/ProductsTitle";

const DefaultProductsPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const { merchantData } = useSelector(
    (state: RootState) => state?.merchantReducer
  );

  const {
    products,
    filters,
    search,
    categories,
    isProductsLoading,
    hasActiveFilters,
    handleOnChangeFilters,
    getCategoryNameFromId,
    onPageChange,
    handleResetFilters,
  } = useProducts({
    fdaApproved: merchantData?.isApplyLegitScript ?? undefined, // undefined means both fda approved and non fda approved products will be shown
  });

  return (
    <div className="theme-bg">
      {/* Page Header */}
      <ProductsTitle isLoading={isProductsLoading} />

      {/* Filters */}
      <div className="bg-white p-6 border-b border-gray-200">
        <div className="container mx-auto">
          <div className=" flex items-center justify-between mb-4">
            <h3 className="text-lg  font-semibold text-black">Filters</h3>
            <div className="flex items-center gap-2">
              {/* Filter Toggle Button - Shows below 767px */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 h-8 px-2 md:hidden"
                title="Toggle filters"
              >
                <Filter className="h-4 w-4" />
                {showFilters ? "Hide" : "Show"} Filters
              </Button>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-gray-500 hover:text-gray-700 h-8 px-2"
                  title="Reset all filters"
                  style={{
                    color: merchantData?.customizeBranding?.accentColor,
                  }}
                >
                  <RotateCcw className="h-4 w-4" /> Reset Filters
                </Button>
              )}
            </div>
          </div>

          {/* Filters Content - Hidden on mobile when showFilters is false */}
          <div className={`md:block ${showFilters ? "block" : "hidden"}`}>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label
                  htmlFor="search-input"
                  className="text-sm font-medium text-gray-700"
                >
                  Search Treatments
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search-input"
                    placeholder="Search treatments..."
                    value={search}
                    onChange={(e) =>
                      handleOnChangeFilters("search", e.target.value)
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <Label
                  htmlFor="category-filter"
                  className="text-sm font-medium text-gray-700"
                >
                  Category
                </Label>
                <Select
                  value={filters?.category}
                  onValueChange={(value) =>
                    handleOnChangeFilters("category", value)
                  }
                >
                  <SelectTrigger id="category-filter" className="relative">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category: Category) => (
                      <SelectItem key={category?._id} value={category?._id}>
                        {category?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div className="space-y-2">
                <Label
                  htmlFor="sort-filter"
                  className="text-sm font-medium text-gray-700"
                >
                  Sort By
                </Label>
                <Select
                  value={filters?.sort}
                  onValueChange={(value) =>
                    handleOnChangeFilters("sort", value)
                  }
                >
                  <SelectTrigger id="sort-filter">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_SORT_OPTIONS.map((option: any) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {filters?.category && products?.total ? (
        <div className="mb-6">
          <p className="theme-text-muted">
            Showing {products?.total} treatment
            {products?.total !== 1 ? "s" : ""}
            {filters?.category !== "all" &&
              ` in ${getCategoryNameFromId(filters?.category)}`}
          </p>
        </div>
      ) : null}

      <div className="bg-white px-6 py-16 lg:px-8">
        <div className="container mx-auto">
          {/* Product Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products?.data?.length ? (
              products?.data?.map((product: Product) => (
                <ProductsCard key={product?._id} product={product} />
              ))
            ) : isProductsLoading ? (
              <div className="col-span-full">
                <ThemeLoader type="products" variant="skeleton" />
              </div>
            ) : (
              <div className="col-span-full">
                <DataNotFound type="products" />
              </div>
            )}
          </div>

          {/* Custom Pagination Component */}
          {products?.total && filters?.page && filters?.limit ? (
            <div className="mt-8">
              <CustomPagination
                currentPage={filters.page}
                totalItems={products.total}
                itemsPerPage={filters.limit}
                onPageChange={onPageChange}
                showInfo={true}
                maxVisiblePages={5}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DefaultProductsPage;
