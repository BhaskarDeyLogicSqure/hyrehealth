"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import ProductsCard from "../Components/ProductsCard";
import { PRODUCT_SORT_OPTIONS } from "@/configs";

const DefaultProductsPage = () => {
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
  } = useProducts();

  return (
    <div className="min-h-screen theme-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold theme-text-primary mb-2 flex items-center">
            All Treatments{" "}
            {isProductsLoading ? (
              <span className="ml-2">
                <ThemeLoader
                  type="inline"
                  variant="simple"
                  size="sm"
                  showIcon={true}
                  className="ml-2"
                />
              </span>
            ) : null}
          </h1>
          <p className="theme-text-muted">
            Explore our comprehensive range of wellness treatments
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold theme-text-primary">
              Filters
            </h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 h-8 px-2"
                title="Reset all filters"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search treatments..."
                value={search}
                onChange={(e) =>
                  handleOnChangeFilters("search", e.target.value)
                }
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={filters?.category}
              onValueChange={(value) =>
                handleOnChangeFilters("category", value)
              }
            >
              <SelectTrigger className="relative">
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

            {/* Sort */}
            <Select
              value={filters?.sort}
              onValueChange={(value) => handleOnChangeFilters("sort", value)}
            >
              <SelectTrigger>
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
  );
};

export default DefaultProductsPage;
