import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateOrderSupportPayload,
  OrderSupportTicket,
  supportApi,
} from "./supportApi";
import { showErrorToast } from "@/components/GlobalErrorHandler";

export const useOrderSupportApi = (orderId?: string, enabled: boolean = true) => {
  const queryClient = useQueryClient();

  const {
    data: orderSupportData,
    isLoading: isOrderSupportLoading,
    error: orderSupportError,
    isError: isOrderSupportError,
  } = useQuery<OrderSupportTicket | null>({
    queryKey: ["orderSupport", orderId],
    queryFn: () => supportApi.getOrderSupport(orderId as string),
    enabled: Boolean(orderId) && enabled,
    retry: false,
  });

  const {
    mutateAsync: createOrderSupport,
    isPending: isCreateOrderSupportLoading,
    error: createOrderSupportError,
  } = useMutation({
    mutationFn: (payload: CreateOrderSupportPayload) =>
      supportApi.createOrderSupport(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["orderSupport", variables?.orderId],
      });
    },
    onError: (error: any) => {
      showErrorToast(error?.message || "Failed to submit support request");
    },
  });

  return {
    orderSupportData,
    isOrderSupportLoading,
    orderSupportError,
    isOrderSupportError,

    createOrderSupport,
    isCreateOrderSupportLoading,
    createOrderSupportError,
  };
};
