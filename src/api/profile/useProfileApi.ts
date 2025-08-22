import { useQuery, useMutation } from "@tanstack/react-query";
import { profileApi } from "./profileApi";
import { STALE_TIME_FOR_REACT_QUERY } from "@/configs";

export const useProfileApi = (
  page?: number,
  limit?: number,
  subscriptionPage?: number,
  subscriptionLimit?: number,
  customerId?: string,
  productId?: string,
  orderId?: string // just for cache purposes for react query
) => {
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
    queryKey: ["subscription", subscriptionPage, subscriptionLimit],
    queryFn: () =>
      profileApi.getUserSubscriptions(subscriptionPage, subscriptionLimit),
    staleTime: STALE_TIME_FOR_REACT_QUERY,
  });

  const {
    data: invoicesData,
    isLoading: isInvoicesLoading,
    error: invoicesError,
    isError: isInvoicesError,
  } = useQuery({
    queryKey: ["invoices", page, limit, customerId],
    queryFn: () => profileApi.getAllInvoices(page, limit, customerId),
    staleTime: STALE_TIME_FOR_REACT_QUERY,
  });

  const {
    data: productReviewData,
    isLoading: isProductReviewLoading,
    error: productReviewError,
    isError: isProductReviewError,
  } = useQuery({
    queryKey: ["productReview", productId, orderId],
    queryFn: () => profileApi.getSingleProductReview(productId || ""),
    staleTime: STALE_TIME_FOR_REACT_QUERY,
  });

  const {
    mutateAsync: createReviewForProduct,
    isPending: isCreateReviewLoading,
    error: createReviewError,
  } = useMutation({
    mutationFn: ({
      productId,
      rating,
      review,
    }: {
      productId: string;
      rating: number;
      review: string;
    }) => profileApi.createReviewForProduct(productId, rating, review),
  });

  return {
    // profile
    profileData,
    isProfileLoading,
    profileError,

    // subscription
    subscriptionData: subscriptionData?.subscriptions,
    subscriptionTotal: subscriptionData?.total,
    isSubscriptionLoading,
    subscriptionError,
    isSubscriptionError,

    // invoices
    invoicesData: invoicesData,
    isInvoicesLoading,
    invoicesError,
    isInvoicesError,

    // product review
    productReviewData: productReviewData,
    isProductReviewLoading,
    productReviewError,
    isProductReviewError,

    // create review for product
    createReviewForProduct,
    isCreateReviewLoading,
    createReviewError,
  };
};
