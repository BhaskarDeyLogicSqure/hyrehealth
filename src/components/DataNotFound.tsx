"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataNotFoundProps {
  type?: "categories" | "products" | "general";
  title?: string;
  description?: string;
  hasSearch?: boolean;
  hasFilters?: boolean;
  searchTerm?: string;
  onClearSearch?: () => void;
  onClearFilters?: () => void;
  onRetry?: () => void;
  className?: string;
  showIcon?: boolean;
}

const DataNotFound: React.FC<DataNotFoundProps> = ({
  type = "general",
  title,
  description,
  //   hasSearch = false,
  //   hasFilters = false,
  //   searchTerm,
  //   onClearSearch,
  //   onClearFilters,
  //   onRetry,
  className,
  showIcon = true,
}) => {
  // Default content based on type
  const getDefaultContent = () => {
    switch (type) {
      case "categories":
        return {
          title: "No Categories Found",
          description:
            "We couldn't find any treatment categories matching your criteria.",
          icon: Package,
        };
      case "products":
        return {
          title: "No Products Found",
          description:
            "We couldn't find any products matching your search criteria.",
          icon: Search,
        };
      default:
        return {
          title: "No Data Found",
          description: "We couldn't find any results matching your criteria.",
          icon: Search,
        };
    }
  };

  const defaultContent = getDefaultContent();
  const displayTitle = title || defaultContent.title;
  const displayDescription = description || defaultContent.description;
  const IconComponent = defaultContent.icon;

  return (
    <Card className={cn("theme-border border-2 border-dashed", className)}>
      <CardContent className="flex flex-col items-center justify-center text-center py-12 px-6">
        {/* Icon */}
        {showIcon && (
          <div className="theme-bg-muted rounded-full p-6 mb-6">
            <IconComponent className="h-12 w-12 theme-text-muted" />
          </div>
        )}

        {/* Title */}
        <h3 className="text-2xl font-bold theme-text-primary mb-3">
          {displayTitle}
        </h3>

        {/* Description */}
        <p className="theme-text-muted mb-6 max-w-md leading-relaxed">
          {displayDescription}
        </p>

        {/* Search Term Display */}
        {/* {hasSearch && searchTerm && (
          <div className="theme-bg-muted rounded-lg px-4 py-2 mb-4 inline-flex items-center">
            <Search className="h-4 w-4 theme-text-muted mr-2" />
            <span className="text-sm theme-text-primary">
              Search: "{searchTerm}"
            </span>
          </div>
        )} */}

        {/* Action Buttons */}
        {/* <div className="flex flex-col sm:flex-row gap-3 mt-4">
          {hasSearch && onClearSearch && (
            <Button
              variant="outline"
              onClick={onClearSearch}
              className="theme-border hover:theme-bg-muted"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Search
            </Button>
          )}

          {hasFilters && onClearFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="theme-border hover:theme-bg-muted"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}

          {onRetry && (
            <Button
              onClick={onRetry}
              className="theme-bg-primary hover:theme-bg-primary/90"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </div> */}

        {/* Suggestions */}
        {/* <div className="mt-8 text-left max-w-md">
          <p className="text-sm font-medium theme-text-primary mb-2">
            Suggestions:
          </p>
          <ul className="text-sm theme-text-muted space-y-1">
            <li>• Check your spelling and try again</li>
            <li>• Try more general search terms</li>
            <li>• Remove some filters to see more results</li>
            {type === "products" && (
              <li>• Browse our categories for inspiration</li>
            )}
          </ul>
        </div> */}
      </CardContent>
    </Card>
  );
};

export default DataNotFound;
