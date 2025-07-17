"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Package, Search, Grid, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeLoaderProps {
  type?: "categories" | "products" | "general" | "grid" | "inline";
  message?: string;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "card" | "simple" | "skeleton";
}

const ThemeLoader: React.FC<ThemeLoaderProps> = ({
  type = "general",
  message,
  className,
  showIcon = true,
  size = "md",
  variant = "card",
}) => {
  // Default content based on type
  const getDefaultContent = () => {
    switch (type) {
      case "categories":
        return {
          message: "Loading Treatment Categories...",
          icon: Package,
        };
      case "products":
        return {
          message: "Loading Products...",
          icon: Search,
        };
      case "grid":
        return {
          message: "Loading Content...",
          icon: Grid,
        };
      case "inline":
        return {
          //   message: "Loading...",
          icon: Loader2,
        };
      default:
        return {
          message: "Loading...",
          icon: Heart,
        };
    }
  };

  const defaultContent = getDefaultContent();
  const displayMessage = message || defaultContent.message;
  const IconComponent = defaultContent.icon;

  // Size configurations
  const sizeConfig = {
    sm: {
      iconSize: "h-6 w-6",
      textSize: "text-sm",
      padding: "py-6 px-4",
      iconPadding: "p-3",
    },
    md: {
      iconSize: "h-8 w-8",
      textSize: "text-base",
      padding: "py-8 px-6",
      iconPadding: "p-4",
    },
    lg: {
      iconSize: "h-12 w-12",
      textSize: "text-lg",
      padding: "py-12 px-8",
      iconPadding: "p-6",
    },
  };

  const currentSize = sizeConfig[size];

  // Simple loader for inline usage
  if (variant === "simple") {
    return (
      <div className={cn("flex items-center justify-center gap-2", className)}>
        <Loader2
          className={cn(
            "animate-spin theme-text-primary",
            currentSize.iconSize
          )}
        />
        <span className={cn("theme-text-muted", currentSize.textSize)}>
          {displayMessage}
        </span>
      </div>
    );
  }

  // Skeleton loader for grid items
  if (variant === "skeleton") {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Grid skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="theme-border">
              <CardContent className="p-6">
                {/* Image skeleton */}
                <div className="theme-bg-muted rounded-xl h-48 mb-4 animate-pulse" />

                {/* Badge skeleton */}
                <div className="theme-bg-muted rounded-full h-6 w-20 mb-3 animate-pulse" />

                {/* Title skeleton */}
                <div className="theme-bg-muted rounded h-6 w-3/4 mb-2 animate-pulse" />

                {/* Description skeleton */}
                <div className="space-y-2 mb-4">
                  <div className="theme-bg-muted rounded h-4 w-full animate-pulse" />
                  <div className="theme-bg-muted rounded h-4 w-2/3 animate-pulse" />
                </div>

                {/* Rating skeleton */}
                <div className="theme-bg-muted rounded h-4 w-1/3 mb-4 animate-pulse" />

                {/* Price skeleton */}
                <div className="theme-bg-muted rounded h-6 w-1/2 mb-4 animate-pulse" />

                {/* Button skeleton */}
                <div className="theme-bg-muted rounded h-10 w-full animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination skeleton */}
        <div className="flex justify-center">
          <div className="theme-bg-muted rounded h-10 w-64 animate-pulse" />
        </div>
      </div>
    );
  }

  // Card loader (default)
  return (
    <Card className={cn("theme-border", className)}>
      <CardContent
        className={cn(
          "flex flex-col items-center justify-center text-center",
          currentSize.padding
        )}
      >
        {/* Animated Icon */}
        {showIcon && (
          <div
            className={cn(
              "theme-bg-muted rounded-full mb-4",
              currentSize.iconPadding
            )}
          >
            {type === "inline" ? (
              <Loader2
                className={cn(
                  "animate-spin theme-text-primary",
                  currentSize.iconSize
                )}
              />
            ) : (
              <div className="relative">
                <IconComponent
                  className={cn("theme-text-muted", currentSize.iconSize)}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2
                    className={cn("animate-spin theme-text-primary", "h-4 w-4")}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading Message */}
        <p
          className={cn(
            "theme-text-primary font-medium mb-2",
            currentSize.textSize
          )}
        >
          {displayMessage}
        </p>

        {/* Loading dots animation */}
        <div className="flex space-x-1">
          <div
            className="w-2 h-2 theme-bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 theme-bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 theme-bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>

        {/* Subtitle for better UX */}
        <p className="theme-text-muted text-xs mt-3">
          Please wait while we fetch the latest data
        </p>
      </CardContent>
    </Card>
  );
};

export default ThemeLoader;
