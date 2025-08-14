import { useQuery } from "@tanstack/react-query";
import { postCheckoutApi } from "@/api/postCheckout/postCheckoutApi";

export const useRenewalDetails = (subscriptionId: string) => {
  const {
    data: renewalDetailsResponse,
    isLoading: isRenewalDetailsLoading,
    isError: isRenewalDetailsError,
    error: renewalDetailsError,
    refetch: refetchRenewalDetails,
  } = useQuery({
    queryKey: ["renewalDetails", subscriptionId],
    queryFn: async () => {
      const response = await postCheckoutApi.getRenewalDetails(subscriptionId);
      return response.data;
    },
    enabled: !!subscriptionId, // Only run query if subscriptionId is provided
    retry: 2,
    retryDelay: 1000,
  });

  return {
    // Renewal details data and state
    renewalDetails: renewalDetailsResponse,
    isRenewalDetailsLoading,
    isRenewalDetailsError,
    renewalDetailsError,

    // Actions
    refetchRenewalDetails,
  };
};
