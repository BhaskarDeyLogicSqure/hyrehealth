import { useQuery } from "@tanstack/react-query";
import { postCheckoutApi } from "./postCheckoutApi";

export const useIntakeFormData = () => {
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
    intakeFormDataQuestions: data?.data?.intakeForms,
    isIntakeFormLoading,
    isIntakeFormError,
    intakeFormError,
  };
};
