import { useQuery } from "@tanstack/react-query";
import { orderConfirmationApi } from "@/api/order-confirmation/orderConfirmationApi";

export const useOrderConfirmation = (orderId: string) => {
  const {
    data: orderConfirmationResponse,
    error: orderConfirmationError,
    isLoading: isOrderConfirmationLoading,
    isError: isOrderConfirmationError,
    refetch: refetchOrderConfirmation,
  } = useQuery({
    queryKey: ["orderConfirmation", orderId],
    queryFn: async () => {
      const response = await orderConfirmationApi.getOrderConfirmation(orderId);
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
