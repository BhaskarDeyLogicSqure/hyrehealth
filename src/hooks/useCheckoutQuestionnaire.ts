import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import {
  setQuestionnaireData,
  setGeneralEligibility,
  setProductResponses,
  addProductResponses,
  setProductEligibility,
  completeQuestionnaire,
  filterToEligibleProducts,
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
  const eligibleProductsTotal = useSelector(
    (state: RootState) => state.checkoutReducer?.eligibleProductsTotal
  );
  const ineligibleProductsTotal = useSelector(
    (state: RootState) => state.checkoutReducer?.ineligibleProductsTotal
  );
  const mainProduct = useSelector(
    (state: RootState) => state.checkoutReducer?.mainProduct
  );
  const relatedProducts = useSelector(
    (state: RootState) => state.checkoutReducer?.relatedProducts
  );

  // Computed values
  const eligibleProducts = useMemo(() => {
    const products = [];

    // Add main product if eligible
    if (
      mainProduct &&
      questionnaire?.eligibleProductIds?.includes(mainProduct?.product?._id)
    ) {
      products?.push({
        type: "main",
        product: mainProduct?.product,
        selectedOption: mainProduct?.selectedOption,
      });
    }

    // Add eligible related products
    relatedProducts?.forEach((relatedProduct) => {
      if (
        questionnaire?.eligibleProductIds?.includes(relatedProduct?.productId)
      ) {
        products?.push({
          type: "related",
          product: relatedProduct?.product,
          selectedOption: relatedProduct?.selectedOption,
        });
      }
    });

    return products;
  }, [mainProduct, relatedProducts, questionnaire.eligibleProductIds]);

  const ineligibleProducts = useMemo(() => {
    const products = [];

    // Add main product if ineligible
    if (
      mainProduct &&
      questionnaire?.ineligibleProductIds?.includes(mainProduct?.product?._id)
    ) {
      products.push({
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
      if (
        questionnaire?.ineligibleProductIds?.includes(relatedProduct?.productId)
      ) {
        products.push({
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
    questionnaire?.ineligibleProductIds,
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

  const getProductResponses = (productId: string) => {
    // Filter product responses by productId field
    return questionnaire?.productResponses?.filter(
      (response) => response?.productId === productId
    );
  };

  const getAllProductResponses = () => {
    return questionnaire?.productResponses;
  };

  const getQuestionnaireProgress = () => {
    if (questionnaire?.totalQuestions === 0) return 0;
    return (
      (questionnaire?.totalQuestionsAnswered / questionnaire?.totalQuestions) *
      100
    );
  };

  const getEligibilityStatus = () => {
    if (!questionnaire?.isCompleted) return "pending";
    if (questionnaire?.generalEligibility === false)
      return "general_ineligible";
    if (questionnaire?.eligibleProductIds.length === 0)
      return "no_eligible_products";
    return "eligible";
  };

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

  const markQuestionnaireComplete = (
    completedAt: string,
    totalQuestions: number,
    totalAnswered: number
  ) => {
    dispatch(
      completeQuestionnaire({ completedAt, totalQuestions, totalAnswered })
    );
  };

  const filterProductsToEligible = () => {
    dispatch(filterToEligibleProducts());
    dispatch(calculateTotal());
  };

  const updateCheckoutStep = (
    step: "questionnaire" | "review" | "payment" | "confirmation"
  ) => {
    dispatch(setCheckoutStep(step));
  };

  const clearQuestionnaire = () => {
    dispatch(clearQuestionnaireData());
  };

  const recalculateTotal = () => {
    dispatch(calculateTotal());
  };

  return {
    // State
    questionnaire,
    isFromQuestionnaire,
    currentStep,
    totalAmount,
    eligibleProductsTotal,
    ineligibleProductsTotal,
    eligibleProducts,
    ineligibleProducts,
    selectedRelatedProducts,
    relatedProductsTotalCost,
    mainProductIfEligible,

    // Computed values
    getProductEligibility,
    getProductResponses,
    getAllProductResponses,
    getQuestionnaireProgress,
    getEligibilityStatus,

    // Actions
    updateQuestionnaireData,
    updateGeneralEligibility,
    updateProductResponses,
    appendProductResponses,
    updateProductEligibility,
    markQuestionnaireComplete,
    filterProductsToEligible,
    updateCheckoutStep,
    clearQuestionnaire,
    recalculateTotal,
  };
};
