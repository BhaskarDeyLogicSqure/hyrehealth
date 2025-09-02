import React from "react";
import { Card, CardContent } from "../ui/card";
import { Package } from "lucide-react";
import { Button } from "../ui/button";
import SubscriptionCard from "./SubscriptionCard";
import CustomPagination from "@/components/CustomPagination";
import ThemeLoader from "@/components/ThemeLoader";
import useSubscription from "@/hooks/useSubscription";
import { useRouter } from "next/navigation";

const SubscriptionTab = () => {
  const router = useRouter();

  const {
    subscriptionsList,
    totalItems,
    isSubscriptionLoading,
    isSubscriptionError,
    subscriptionError,
    dataPayload,
    _handlePageChange,
  } = useSubscription();

  const _redirectToProducts = () => {
    router.push("/products");
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
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Unable to Load Subscriptions
          </h3>
          <p className="text-gray-600 mb-4 text-base">
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
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            No Active Subscriptions
          </h3>
          <p className="text-gray-600 mb-4 text-base">
            Start your health journey with our personalized treatments
          </p>
          <Button
            onClick={_redirectToProducts}
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
            key={subscription?._id}
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
            onClick={_redirectToProducts}
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
