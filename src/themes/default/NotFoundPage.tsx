"use client";

import { useNavigationState } from "@/hooks/useNavigationState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Home,
  ArrowLeft,
  Search,
  Stethoscope,
  Heart,
  Shield,
} from "lucide-react";
import ThemeLoader from "@/components/ThemeLoader";

const DefaultNotFoundPage = () => {
  const { navigateWithLoading, navigateBack, isNavigatingTo } =
    useNavigationState();

  const handleGoHome = () => {
    navigateWithLoading("/");
  };

  const handleGoBack = () => {
    navigateBack([], "/");
  };

  const handleBrowseProducts = () => {
    navigateWithLoading("/products");
  };

  const isLoadingHome = isNavigatingTo("/");
  const isLoadingProducts = isNavigatingTo("/products");

  return (
    <div className="min-h-screen theme-bg flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Main 404 Visual */}
        <div className="mb-8">
          <div className="relative">
            {/* Large 404 Number */}
            <h1 className="text-9xl font-bold theme-text-primary opacity-20 select-none">
              404
            </h1>

            {/* Medical Cross Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-blue-100 rounded-full p-6">
                <Stethoscope className="h-16 w-16 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold theme-text-primary mb-4">
            Page Not Found
          </h2>
          <p className="text-lg theme-text-muted mb-2">
            Oops! It seems like this page has gone on a health retreat.
          </p>
          <p className="theme-text-muted">
            The page you're looking for doesn't exist or has been moved to a
            healthier location.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card
            className={`hover:shadow-md transition-shadow cursor-pointer ${
              isLoadingHome ? "opacity-75 pointer-events-none" : ""
            }`}
            onClick={handleGoHome}
          >
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 rounded-full p-3 w-fit mx-auto mb-3">
                <Home className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold theme-text-primary mb-2">Go Home</h3>
              <p className="text-sm theme-text-muted">
                Return to our wellness dashboard
              </p>
            </CardContent>
          </Card>

          <Card
            className={`hover:shadow-md transition-shadow cursor-pointer ${
              isLoadingProducts ? "opacity-75 pointer-events-none" : ""
            }`}
            onClick={handleBrowseProducts}
          >
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 rounded-full p-3 w-fit mx-auto mb-3">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold theme-text-primary mb-2">
                Browse Treatments
              </h3>
              <p className="text-sm theme-text-muted">
                Explore our health solutions
              </p>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={handleGoBack}
          >
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 rounded-full p-3 w-fit mx-auto mb-3">
                <ArrowLeft className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold theme-text-primary mb-2">Go Back</h3>
              <p className="text-sm theme-text-muted">
                Return to previous page
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleGoHome}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            disabled={isLoadingHome}
          >
            {isLoadingHome ? (
              <ThemeLoader
                type="inline"
                variant="simple"
                size="sm"
                message="Loading..."
                className="gap-2"
              />
            ) : (
              <>
                <Home className="h-4 w-4 mr-2" />
                Take Me Home
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleBrowseProducts}
            className="px-8 py-3"
            disabled={isLoadingProducts}
          >
            {isLoadingProducts ? (
              <ThemeLoader
                type="inline"
                variant="simple"
                size="sm"
                message="Loading..."
                className="gap-2"
              />
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Browse Treatments
              </>
            )}
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm theme-text-muted">Need assistance?</span>
          </div>
          <p className="text-sm theme-text-muted">
            If you believe this is an error, please{" "}
            <a
              href="/contact"
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              contact our support team
            </a>{" "}
            for help with your wellness journey.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 flex justify-center space-x-2 opacity-30">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div
            className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default DefaultNotFoundPage;
