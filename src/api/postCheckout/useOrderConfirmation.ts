import { useQuery } from "@tanstack/react-query";
import { postCheckoutApi } from "@/api/postCheckout/postCheckoutApi";

export const useOrderConfirmation = (orderId: string | null) => {
  const {
    data: orderConfirmationResponse,
    error: orderConfirmationError,
    isLoading: isOrderConfirmationLoading,
    isError: isOrderConfirmationError,
    refetch: refetchOrderConfirmation,
  } = useQuery({
    queryKey: ["orderConfirmation", orderId],
    queryFn: async () => {
      const response = await postCheckoutApi.getOrderConfirmation(orderId);
      return response.data;
    },
    enabled: !!orderId, // Only run query if orderId is provided
    retry: 2,
    retryDelay: 1000,
  });

  return {
    // Order confirmation data and state
    orderConfirmation: orderConfirmationResponse,
    isOrderConfirmationLoading,
    isOrderConfirmationError,
    orderConfirmationError,

    // Actions
    refetchOrderConfirmation,
  };
};
