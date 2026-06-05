import { useQuery } from "@tanstack/react-query";
import { postCheckoutApi } from "./postCheckoutApi";

export const useDisclaimerStatus = (orderId: string | null) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["disclaimerStatus", orderId],
    queryFn: () => postCheckoutApi.getDisclaimerStatus(orderId!),
    enabled: !!orderId,
    refetchOnWindowFocus: true,
  });

  return {
    disclaimerStatus: data?.data,
    isDisclaimerSigned: data?.data?.alreadySigned ?? false,
    isDisclaimerStatusLoading: isLoading,
    isDisclaimerStatusError: isError,
    disclaimerStatusError: error,
    refetchDisclaimer: refetch,
  };
};
