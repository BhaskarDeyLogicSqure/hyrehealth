import { useMutation } from "@tanstack/react-query";
import { checkoutApi } from "./checkoutApi";
import { ApiResponse } from "..";
import { showErrorToast } from "@/components/GlobalErrorHandler";

// Define proper types for the checkout payload and response
interface CheckoutPayload {
  // Add specific fields based on your checkout requirements
  [key: string]: any;
}

interface CheckoutResponse {
  // Add specific fields based on your API response
  [key: string]: any;
}

const useChekoutApi = () => {
  const {
    data: checkoutData,
    error: checkoutError,
    isPending: isCheckoutLoading,
    isError: isCheckoutError,
    mutateAsync: signUpWithPayment,
    reset: resetCheckout,
  } = useMutation<ApiResponse<CheckoutResponse>, Error, CheckoutPayload>({
    mutationFn: (payload: CheckoutPayload) =>
      checkoutApi.signUpWithPayment(payload),
    onSuccess: (data) => {
      console.log({ data });
      if (data?.status === 200) {
        return data?.data;
      }
    },
    onError: (error) => {
      console.log({ error });
      showErrorToast(error?.message);
    },
  });

  return {
    // Checkout data and state
    checkoutData: checkoutData?.data,
    isCheckoutLoading,
    isCheckoutError,
    checkoutError,

    // Actions
    signUpWithPayment,
    resetCheckout,
  };
};

export default useChekoutApi;
