import React, { useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Package } from "lucide-react";
import { Button } from "../ui/button";
import SubscriptionCard from "./SubscriptionCard";
import { useProfileApi } from "@/api/profile/useProfileApi";
import ThemeLoader from "@/components/ThemeLoader";

const SubscriptionTab = () => {
  const {
    subscriptionData,
    isSubscriptionLoading,
    subscriptionError,
    isSubscriptionError,
  } = useProfileApi();

  console.log({
    subscriptionData,
    isSubscriptionLoading,
    subscriptionError,
  });

  // Show loading state
  if (isSubscriptionLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <ThemeLoader type="inline" variant="simple" size="lg" />
        </div>
      </div>
    );
  }

  // Show error state
  if (isSubscriptionError) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Unable to Load Subscriptions
          </h3>
          <p className="text-gray-600 mb-4">
            {subscriptionError?.message ||
              "Failed to load your subscriptions. Please try again later."}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-brand-dark-blue hover:bg-brand-dark-blue/90"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show empty state if no subscriptions
  if (!subscriptionData || subscriptionData?.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Active Subscriptions
          </h3>
          <p className="text-gray-600 mb-4">
            Start your health journey with our personalized treatments
          </p>
          <Button
            onClick={() => (window.location.href = "/products")}
            className="bg-brand-dark-blue hover:bg-brand-dark-blue/90"
          >
            Browse Treatments
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {subscriptionData?.map((subscription: any) => (
          <SubscriptionCard
            key={subscription?._doc?._id}
            subscription={subscription}
          />
        ))}
      </div>

      {/* Add New Subscription */}
      <Card className="mt-8 border-dashed">
        <CardContent className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Add Another Treatment
          </h3>
          <p className="text-gray-600 mb-4">
            Explore our comprehensive range of personalized treatments
          </p>
          <Button
            onClick={() => (window.location.href = "/products")}
            className="bg-brand-dark-blue hover:bg-brand-dark-blue/90"
          >
            Browse Treatments
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default SubscriptionTab;
