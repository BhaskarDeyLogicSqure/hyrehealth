import { useQuery } from "@tanstack/react-query";
import { postCheckoutApi } from "./postCheckoutApi";

export const useDisclaimerStatus = (
  orderId: string | null,
  options?: { enabled?: boolean },
) => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ["disclaimerStatus", orderId],
    queryFn: () => postCheckoutApi.getDisclaimerStatus(orderId!),
    enabled: !!orderId && (options?.enabled ?? true),
    refetchOnWindowFocus: true,
  });

  return {
    disclaimerStatus: data?.data,
    isDisclaimerSigned: data?.data?.alreadySigned ?? false,
    isDisclaimerStatusLoading: isLoading,
    isDisclaimerStatusFetched: isFetched,
    isDisclaimerStatusError: isError,
    disclaimerStatusError: error,
    refetchDisclaimer: refetch,
  };
};
