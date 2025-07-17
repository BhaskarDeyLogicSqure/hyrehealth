"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Star, ArrowUpDown, Loader2, X } from "lucide-react";
import { Product } from "@/types/products";
import Image from "next/image";
import { DEFAULT_IMAGE_URL } from "@/configs";
import { Category } from "@/types/categories";
import useProducts from "@/hooks/useProducts";
import { useRouter } from "next/navigation";
import CustomPagination from "@/components/CustomPagination";
import DataNotFound from "@/components/DataNotFound";
import ThemeLoader from "@/components/ThemeLoader";

const DefaultProductsPage = () => {
  const router = useRouter();

  const {
    products,
    filters,
    search,
    categories,
    isProductsLoading,
    handleOnChangeFilters,
    getCategoryNameFromId,
    onPageChange,
  } = useProducts();

  const _handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

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
              value={filters?.sortBy}
              onValueChange={(value) => handleOnChangeFilters("sortBy", value)}
            >
              <SelectTrigger>
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
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
              <Card
                key={product?._id}
                className="hover:shadow-lg transition-shadow cursor-pointer h-full"
              >
                <CardContent className="p-6 h-full flex flex-col">
                  {/* Product Image */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 mb-4 text-center h-48 flex items-center justify-center">
                    {product?.media?.images[0]?.url ? (
                      <Image
                        // src={product?.media?.images[0]?.url}
                        src={DEFAULT_IMAGE_URL}
                        alt={product?.name}
                        width={48}
                        height={48}
                        className="rounded-xl"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm">
                        <span className="text-2xl font-bold text-blue-600">
                          {product?.name?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Category Badge */}
                  {product?.category?.length > 0 ? (
                    <Badge variant="secondary" className="mb-3 w-fit">
                      {product?.category?.[0]?.name}
                    </Badge>
                  ) : null}

                  {/* Product Info */}
                  <h3 className="text-xl font-semibold theme-text-primary mb-2">
                    {product?.name}
                  </h3>
                  {product?.contentAndDescription?.shortDescription ? (
                    <p className="theme-text-muted text-sm mb-4 line-clamp-2 flex-grow">
                      {product?.contentAndDescription?.shortDescription}
                    </p>
                  ) : null}

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">
                      {product?.rating}
                    </span>
                    <span className="ml-1 text-sm theme-text-muted">
                      ({product?.reviews?.length})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold theme-text-primary">
                        ${product?.pricing?.basePrice}
                      </span>
                      <span className="theme-text-muted text-sm">/month</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    className="w-full mt-auto"
                    onClick={() => _handleProductClick(product?._id)}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
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
