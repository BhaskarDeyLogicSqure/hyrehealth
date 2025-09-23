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
  // order checkout with signup - for new users
  const {
    data: checkoutData,
    error: checkoutError,
    isPending: isCheckoutLoading,
    isError: isCheckoutError,
    mutateAsync: signUpWithPayment,
    reset: resetCheckout,
  } = useMutation<CheckoutResponse, Error, CheckoutPayload>({
    mutationFn: (payload: CheckoutPayload) =>
      checkoutApi.signUpWithPayment(payload),
    onSuccess: (data) => {
      return data;
    },
    // onError: (error) => {
    //   console.log({ error });
    //   showErrorToast(error?.message);
    // },
  });

  // order checkout - for login users
  const {
    data: loginOrderCheckoutData,
    error: loginOrderCheckoutError,
    isPending: isLoginOrderCheckoutLoading,
    isError: isLoginOrderCheckoutError,
    mutateAsync: loginOrderCheckout,
  } = useMutation<CheckoutResponse, Error, CheckoutPayload>({
    mutationFn: (payload: CheckoutPayload) =>
      checkoutApi.orderCheckout(payload),
  });

  // validate coupon
  const {
    data: validateCouponData,
    error: validateCouponError,
    isPending: isValidateCouponLoading,
    isError: isValidateCouponError,
    mutateAsync: validateCoupon,
  } = useMutation<
    ApiResponse<CheckoutResponse>,
    Error,
    { couponCode: string; productIds: string[] }
  >({
    mutationFn: (payload: { couponCode: string; productIds: string[] }) =>
      checkoutApi.validateCoupon(payload),
    onSuccess: (data) => {
      if (data?.status === 200) {
        return {
          error: false,
          message: data?.message,
          data: data?.data,
        };
      }
    },
    onError: (error) => {
      console.log({ error });
      showErrorToast(error?.message);
      return {
        error: true,
        message: error?.message,
        data: null,
      };
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

    // Validate coupon data and state
    validateCouponData: validateCouponData?.data,
    isValidateCouponLoading,
    isValidateCouponError,
    validateCouponError,

    // Actions
    validateCoupon,

    // Login order checkout data and state
    loginOrderCheckoutData: loginOrderCheckoutData?.data,
    isLoginOrderCheckoutLoading,
    isLoginOrderCheckoutError,
    loginOrderCheckoutError,

    // Actions
    loginOrderCheckout,
  };
};

export default useChekoutApi;
