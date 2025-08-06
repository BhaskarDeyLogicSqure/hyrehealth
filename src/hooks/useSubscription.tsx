import { useState } from "react";
import { useProfileApi } from "@/api/profile/useProfileApi";

const useSubscription = () => {
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

  return {
    subscriptionsList,
    totalItems,
    isSubscriptionLoading,
    isSubscriptionError,
    subscriptionError,
    dataPayload,
    _handlePageChange,
  };
};

export default useSubscription;
