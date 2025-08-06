import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Package } from "lucide-react";
import { Button } from "../ui/button";
import SubscriptionCard from "./SubscriptionCard";
import { useProfileApi } from "@/api/profile/useProfileApi";
import CustomPagination from "@/components/CustomPagination";
import ThemeLoader from "@/components/ThemeLoader";

const SubscriptionTab = () => {
  const [dataPayload, setDataPayload] = useState({
    page: 1,
    limit: 10,
  });

  const {
    subscriptionData,
    subscriptionPagination,
    isSubscriptionLoading,
    subscriptionError,
    isSubscriptionError,
  } = useProfileApi(
    undefined,
    undefined,
    dataPayload?.page,
    dataPayload?.limit
  );

  console.log({
    subscriptionData,
    subscriptionPagination,
    isSubscriptionLoading,
    subscriptionError,
  });

  // Handle pagination data structure
  const subscriptionsList = Array.isArray(subscriptionData)
    ? subscriptionData
    : subscriptionData || [];
  const paginationData = Array.isArray(subscriptionData)
    ? null
    : subscriptionPagination;

  // Calculate pagination
  const totalItems = paginationData?.total || subscriptionsList?.length || 0;

  const _handlePageChange = (page: number = 1) => {
    setDataPayload({ ...dataPayload, page });
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
  if (!subscriptionsList || subscriptionsList?.length === 0) {
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
        {subscriptionsList?.map((subscription: any) => (
          <SubscriptionCard
            key={subscription?._doc?._id}
            subscription={subscription}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="mt-8">
          <CustomPagination
            currentPage={dataPayload?.page}
            totalItems={totalItems}
            itemsPerPage={dataPayload?.limit}
            onPageChange={_handlePageChange}
            showInfo={true}
            maxVisiblePages={5}
          />
        </div>
      )}

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
