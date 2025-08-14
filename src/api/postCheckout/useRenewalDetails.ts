import { useQuery } from "@tanstack/react-query";
import { postCheckoutApi } from "@/api/postCheckout/postCheckoutApi";

export const useRenewalDetails = (subscriptionId: string) => {
  const {
    data: renewalDetails,
    isLoading: isRenewalDetailsLoading,
    isError: isRenewalDetailsError,
    error: renewalDetailsError,
  } = useQuery({
    queryKey: ["renewalDetails", subscriptionId],
    queryFn: () => postCheckoutApi.getRenewalDetails(subscriptionId),
    enabled: !!subscriptionId, // Only run query if subscriptionId is provided
    retry: 2,
    retryDelay: 1000,
  });

  return {
    renewalDetails,
    isRenewalDetailsLoading,
    isRenewalDetailsError,
    renewalDetailsError,
  };
};
