import { useQuery } from "@tanstack/react-query";
import { postCheckoutApi } from "@/api/postCheckout/postCheckoutApi";

export const usePostConsultationSummary = (consultationId: string) => {
  const {
    data: postConsultationSummaryResponse,
    error: postConsultationSummaryError,
    isLoading: isPostConsultationSummaryLoading,
    isError: isPostConsultationSummaryError,
    refetch: refetchPostConsultationSummary,
  } = useQuery({
    queryKey: ["postConsultationSummary", consultationId],
    queryFn: async () => {
      const response = await postCheckoutApi.getPostConsultationSummary(
        consultationId
      );
      return response.data;
    },
    enabled: !!consultationId, // Only run query if consultationId is provided
    retry: 2,
    retryDelay: 1000,
  });

  return {
    // Post consultation summary data and state
    postConsultationSummary: postConsultationSummaryResponse,
    isPostConsultationSummaryLoading,
    isPostConsultationSummaryError,
    postConsultationSummaryError,

    // Actions
    refetchPostConsultationSummary,
  };
};
