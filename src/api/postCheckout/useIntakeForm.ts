import { useQuery } from "@tanstack/react-query";
import { postCheckoutApi } from "./postCheckoutApi";

export const useIntakeForm = () => {
  const {
    data,
    isPending: isIntakeFormLoading,
    isError: isIntakeFormError,
    error: intakeFormError,
  } = useQuery({
    queryKey: ["intake-form"],
    queryFn: () => postCheckoutApi.getIntakeFormQuestions(),
    retry: 2,
    retryDelay: 1000,
  });

  return {
    data,
    isIntakeFormLoading,
    isIntakeFormError,
    intakeFormError,
  };
};
