import { useQuery } from "@tanstack/react-query";
import { profileApi } from "./profileApi";
import { STALE_TIME_FOR_REACT_QUERY } from "@/configs";

export const useProfileApi = (page?: number, limit?: number) => {
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => profileApi.getProfile(),
  });

  const {
    data: subscriptionData,
    isLoading: isSubscriptionLoading,
    error: subscriptionError,
    isError: isSubscriptionError,
  } = useQuery({
    queryKey: ["subscription"],
    queryFn: () => profileApi.getUserSubscriptions(),
    staleTime: STALE_TIME_FOR_REACT_QUERY,
  });

  const {
    data: invoicesData,
    isLoading: isInvoicesLoading,
    error: invoicesError,
    isError: isInvoicesError,
  } = useQuery({
    queryKey: ["invoices", page, limit],
    queryFn: () => profileApi.getAllInvoices(page, limit),
    staleTime: STALE_TIME_FOR_REACT_QUERY,
  });

  return {
    // profile
    profileData,
    isProfileLoading,
    profileError,

    // subscription
    subscriptionData: subscriptionData?.subscriptions,
    isSubscriptionLoading,
    subscriptionError,
    isSubscriptionError,

    // invoices
    invoicesData: invoicesData,
    isInvoicesLoading,
    invoicesError,
    isInvoicesError,
  };
};
