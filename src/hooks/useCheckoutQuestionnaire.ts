import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import {
  setQuestionnaireData,
  setGeneralEligibility,
  setProductResponses,
  addProductResponses,
  setProductEligibility,
  completeQuestionnaire,
  calculateTotal,
  setCheckoutStep,
  clearQuestionnaireData,
  QuestionnaireResponse,
  ProductEligibility,
  QuestionnaireData,
} from "@/store/slices/checkoutSlice";
import { useMemo } from "react";

export const useCheckoutQuestionnaire = () => {
  const dispatch = useDispatch();

  const state = useSelector((state: RootState) => state.checkoutReducer);
  console.log("parent state", { state });

  // Get questionnaire data from Redux
  const questionnaire = useSelector(
    (state: RootState) => state.checkoutReducer?.questionnaire
  );
  const isFromQuestionnaire = useSelector(
    (state: RootState) => state.checkoutReducer?.isFromQuestionnaire
  );
  const currentStep = useSelector(
    (state: RootState) => state.checkoutReducer?.currentStep
  );
  const totalAmount = useSelector(
    (state: RootState) => state.checkoutReducer?.totalAmount
  );
  // const eligibleProductsTotal = useSelector(
  //   (state: RootState) => state.checkoutReducer?.eligibleProductsTotal
  // );
  const mainProduct = useSelector(
    (state: RootState) => state.checkoutReducer?.mainProduct
  );
  const relatedProducts = useSelector(
    (state: RootState) => state.checkoutReducer?.relatedProducts
  );

  console.log({ mainProduct, relatedProducts });
  // Helper functions to get eligible/ineligible product IDs
  const getEligibleProductIds = useMemo(() => {
    return (
      questionnaire?.productEligibilities
        ?.filter((p) => p?.isEligible === true)
        ?.map((p) => p?.productId) || []
    );
  }, [questionnaire?.productEligibilities]);

  const getIneligibleProductIds = useMemo(() => {
    return (
      questionnaire?.productEligibilities
        ?.filter((p) => p?.isEligible === false)
        ?.map((p) => p?.productId) || []
    );
  }, [questionnaire?.productEligibilities]);

  // Computed values
  const eligibleProducts = useMemo(() => {
    const products = [];

    // Add main product if eligible
    if (
      mainProduct &&
      getEligibleProductIds?.includes(mainProduct?.product?._id)
    ) {
      products?.push({
        type: "main",
        product: mainProduct?.product,
        selectedOption: mainProduct?.selectedOption,
      });
    }

    // Add eligible related products
    relatedProducts?.forEach((relatedProduct) => {
      if (getEligibleProductIds?.includes(relatedProduct?.productId)) {
        products?.push({
          type: "related",
          product: relatedProduct?.product,
          selectedOption: relatedProduct?.selectedOption,
        });
      }
    });

    return products;
  }, [mainProduct, relatedProducts, getEligibleProductIds]);

  const ineligibleProducts = useMemo(() => {
    const products = [];

    // Add main product if ineligible
    if (
      mainProduct &&
      getIneligibleProductIds?.includes(mainProduct?.product?._id)
    ) {
      products?.push({
        type: "main",
        product: mainProduct?.product,
        selectedOption: mainProduct?.selectedOption,
        eligibilityData: questionnaire?.productEligibilities?.find(
          (p) => p?.productId === mainProduct?.product?._id
        ),
      });
    }

    // Add ineligible related products
    relatedProducts?.forEach((relatedProduct) => {
      if (getIneligibleProductIds?.includes(relatedProduct?.productId)) {
        products?.push({
          type: "related",
          product: relatedProduct?.product,
          selectedOption: relatedProduct?.selectedOption,
          eligibilityData: questionnaire?.productEligibilities?.find(
            (p) => p?.productId === relatedProduct?.productId
          ),
        });
      }
    });

    return products;
  }, [
    mainProduct,
    relatedProducts,
    getIneligibleProductIds,
    questionnaire?.productEligibilities,
  ]);

  const selectedRelatedProducts = useMemo(() => {
    // filter eligible products and return only related products out of it
    return eligibleProducts
      ?.filter((product) => product?.type === "related")
      ?.map((product) => product?.product);
  }, [eligibleProducts]);

  const relatedProductsTotalCost = useMemo(() => {
    return selectedRelatedProducts?.reduce((acc, product) => {
      const relatedProduct = eligibleProducts?.find(
        (p) => p?.product?._id === product?._id
      );
      return acc + (relatedProduct?.selectedOption?.price || 0);
    }, 0);
  }, [selectedRelatedProducts, eligibleProducts]);

  const mainProductIfEligible = useMemo(() => {
    const mainProduct = eligibleProducts?.find((p) => p?.type === "main");
    return mainProduct?.product;
  }, [eligibleProducts]);

  // Helper functions
  const getProductEligibility = (productId: string) => {
    return questionnaire?.productEligibilities?.find(
      (p) => p?.productId === productId
    );
  };

  // Check if user is eligible for checkout
  const isEligibleForCheckout = useMemo(() => {
    return (
      questionnaire?.generalEligibility === true && eligibleProducts?.length > 0
    );
  }, [questionnaire?.generalEligibility, eligibleProducts]);

  // Action dispatchers
  const updateQuestionnaireData = (data: Partial<QuestionnaireData>) => {
    dispatch(setQuestionnaireData(data));
  };

  const updateGeneralEligibility = (
    isEligible: boolean,
    responses: QuestionnaireResponse[]
  ) => {
    dispatch(setGeneralEligibility({ isEligible, responses }));
  };

  const updateProductResponses = (responses: QuestionnaireResponse[]) => {
    dispatch(setProductResponses(responses));
  };

  const appendProductResponses = (responses: QuestionnaireResponse[]) => {
    dispatch(addProductResponses(responses));
  };

  const updateProductEligibility = (eligibilityData: ProductEligibility) => {
    dispatch(setProductEligibility(eligibilityData));
  };

  const completeQuestionnaireProcess = (
    completedAt: string,
    totalQuestions: number,
    totalAnswered: number
  ) => {
    dispatch(
      completeQuestionnaire({ completedAt, totalQuestions, totalAnswered })
    );
  };

  const recalculateTotal = () => {
    dispatch(calculateTotal());
  };

  const updateCheckoutStep = (
    step: "questionnaire" | "review" | "payment" | "confirmation"
  ) => {
    dispatch(setCheckoutStep(step));
  };

  const clearQuestionnaireState = () => {
    dispatch(clearQuestionnaireData());
  };

  const recalculateAndUpdate = () => {
    dispatch(calculateTotal());
  };

  return {
    // State
    questionnaire,
    isFromQuestionnaire,
    currentStep,
    totalAmount,
    // eligibleProductsTotal,
    mainProduct,
    relatedProducts,
    eligibleProducts,
    ineligibleProducts,
    selectedRelatedProducts,
    relatedProductsTotalCost,
    mainProductIfEligible,
    isEligibleForCheckout,
    eligibleProductIds: getEligibleProductIds,
    ineligibleProductIds: getIneligibleProductIds,

    // Helper functions
    getProductEligibility,

    // Actions
    updateQuestionnaireData,
    updateGeneralEligibility,
    updateProductResponses,
    appendProductResponses,
    updateProductEligibility,
    completeQuestionnaireProcess,
    recalculateTotal,
    updateCheckoutStep,
    clearQuestionnaireState,
    recalculateAndUpdate,
  };
};
