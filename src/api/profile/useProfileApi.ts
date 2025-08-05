import { useQuery } from "@tanstack/react-query";
import { profileApi } from "./profileApi";
import { STALE_TIME_FOR_REACT_QUERY } from "@/configs";

export const useProfileApi = () => {
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

  return {
    profileData,
    isProfileLoading,
    profileError,
    subscriptionData: subscriptionData?.subscriptions,
    isSubscriptionLoading,
    subscriptionError,
    isSubscriptionError,
  };
};
