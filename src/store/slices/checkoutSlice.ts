import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/products";
import { QuestionType } from "@/types/questionnaire";

// Define interface for selected dosage and duration
interface SelectedOption {
  dosageId: string;
  dosageStrength: number;
  duration: number;
  price: number;
}

// Define interface for main product in checkout
interface MainProduct {
  product: Product;
  selectedOption: SelectedOption;
}

// Define interface for related products in checkout
interface RelatedProduct {
  productId: string;
  product: Product;
  selectedOption: SelectedOption;
}

// Define interface for questionnaire responses
interface QuestionnaireResponse {
  questionId: string;
  questionText: string;
  questionType: QuestionType;
  answer: any; // Can be string, string[], number, boolean, etc.
  isCorrect?: boolean;
  productId?: string; // Product ID for product-specific questions
}

// Define interface for product eligibility
interface ProductEligibility {
  productId: string;
  productName: string;
  isEligible: boolean | null; // null = not evaluated, true = eligible, false = ineligible
  responses: QuestionnaireResponse[];
  ineligibilityReason?: string;
}

// Define interface for questionnaire data
interface QuestionnaireData {
  isCompleted: boolean;
  completedAt?: string;
  generalEligibility: boolean | null;
  generalResponses: QuestionnaireResponse[];
  productResponses: QuestionnaireResponse[]; // All product responses in one array
  productEligibilities: ProductEligibility[];
  overallEligible: boolean | null;
  eligibleProductIds: string[];
  ineligibleProductIds: string[];
  totalQuestionsAnswered: number;
  totalQuestions: number;
}

// Define the checkout state interface
export interface CheckoutState {
  // Product data
  mainProduct: MainProduct | null;
  relatedProducts: RelatedProduct[];

  // Questionnaire data
  questionnaire: QuestionnaireData;

  // Cart calculations
  totalAmount: number;
  eligibleProductsTotal: number;
  ineligibleProductsTotal: number;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Checkout flow state
  currentStep: "questionnaire" | "review" | "payment" | "confirmation";
  isFromQuestionnaire: boolean;
}

// Initial questionnaire state
const initialQuestionnaireState: QuestionnaireData = {
  isCompleted: false,
  generalEligibility: null,
  generalResponses: [],
  productResponses: [],
  productEligibilities: [],
  overallEligible: null,
  eligibleProductIds: [],
  ineligibleProductIds: [],
  totalQuestionsAnswered: 0,
  totalQuestions: 0,
};

// Initial state
const initialState: CheckoutState = {
  mainProduct: null,
  relatedProducts: [],
  questionnaire: initialQuestionnaireState,
  totalAmount: 0,
  eligibleProductsTotal: 0,
  ineligibleProductsTotal: 0,
  isLoading: false,
  error: null,
  currentStep: "questionnaire",
  isFromQuestionnaire: false,
};

// Create the checkout slice
const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    // Set main product with selected dosage and duration
    setMainProduct: (state, action: PayloadAction<MainProduct>) => {
      state.mainProduct = action?.payload;
      state.error = null;
    },

    // Set related products with their selected dosage and duration
    setRelatedProducts: (state, action: PayloadAction<RelatedProduct[]>) => {
      state.relatedProducts = action?.payload;
      state.error = null;
    },

    // Add a single related product
    addRelatedProduct: (state, action: PayloadAction<RelatedProduct>) => {
      const existingIndex = state?.relatedProducts?.findIndex(
        (item) => item.productId === action?.payload?.productId
      );

      if (existingIndex >= 0) {
        // Update existing product
        state.relatedProducts[existingIndex] = action?.payload;
      } else {
        // Add new product
        state.relatedProducts?.push(action?.payload);
      }
      state.error = null;
    },

    // Remove a related product
    removeRelatedProduct: (state, action: PayloadAction<string>) => {
      state.relatedProducts = state?.relatedProducts?.filter(
        (item) => item.productId !== action?.payload
      );
      state.error = null;
    },

    // Set questionnaire data
    setQuestionnaireData: (
      state,
      action: PayloadAction<Partial<QuestionnaireData>>
    ) => {
      state.questionnaire = { ...state.questionnaire, ...action.payload };
      state.error = null;
    },

    // Set general eligibility
    setGeneralEligibility: (
      state,
      action: PayloadAction<{
        isEligible: boolean;
        responses: QuestionnaireResponse[];
      }>
    ) => {
      state.questionnaire.generalEligibility = action?.payload?.isEligible;
      state.questionnaire.generalResponses = action?.payload?.responses;
    },

    // Set product responses
    setProductResponses: (
      state,
      action: PayloadAction<QuestionnaireResponse[]>
    ) => {
      state.questionnaire.productResponses = action?.payload;
    },

    // Add product responses (append to existing)
    addProductResponses: (
      state,
      action: PayloadAction<QuestionnaireResponse[]>
    ) => {
      // Remove any existing responses for the same questions to avoid duplicates
      const newResponseQuestionIds = action?.payload?.map((r) => r?.questionId);
      state.questionnaire.productResponses =
        state?.questionnaire?.productResponses?.filter(
          (r) => !newResponseQuestionIds.includes(r?.questionId)
        );
      // Add new responses
      state?.questionnaire?.productResponses?.push(...action?.payload);
    },

    // Set product eligibility
    setProductEligibility: (
      state,
      action: PayloadAction<ProductEligibility>
    ) => {
      const existingIndex =
        state?.questionnaire?.productEligibilities?.findIndex(
          (item) => item?.productId === action?.payload?.productId
        );

      if (existingIndex >= 0) {
        state.questionnaire.productEligibilities[existingIndex] =
          action?.payload;
      } else {
        state?.questionnaire?.productEligibilities?.push(action?.payload);
      }

      // Update eligible/ineligible product lists
      state.questionnaire.eligibleProductIds =
        state?.questionnaire?.productEligibilities
          ?.filter((p) => p?.isEligible === true)
          ?.map((p) => p?.productId);

      state.questionnaire.ineligibleProductIds =
        state?.questionnaire?.productEligibilities
          ?.filter((p) => p?.isEligible === false)
          ?.map((p) => p?.productId);

      // Update overall eligibility
      state.questionnaire.overallEligible =
        state?.questionnaire?.generalEligibility === true &&
        state?.questionnaire?.eligibleProductIds?.length > 0;
    },

    // Complete questionnaire
    completeQuestionnaire: (
      state,
      action: PayloadAction<{
        completedAt: string;
        totalQuestions: number;
        totalAnswered: number;
      }>
    ) => {
      state.questionnaire.isCompleted = true;
      state.questionnaire.completedAt = action?.payload?.completedAt;
      state.questionnaire.totalQuestions = action?.payload?.totalQuestions;
      state.questionnaire.totalQuestionsAnswered =
        action?.payload?.totalAnswered;
      state.isFromQuestionnaire = true;
      state.currentStep = "review";
    },

    // Filter products to only eligible ones
    filterToEligibleProducts: (state) => {
      // Filter main product
      if (
        state?.mainProduct &&
        !state?.questionnaire?.eligibleProductIds?.includes(
          state?.mainProduct?.product?._id
        )
      ) {
        state.mainProduct = null;
      }

      // Filter related products
      state.relatedProducts = state?.relatedProducts?.filter((product) =>
        state?.questionnaire?.eligibleProductIds?.includes(product?.productId)
      );
    },

    // Calculate and set total amount
    calculateTotal: (state) => {
      let total = 0;
      let eligibleTotal = 0;
      let ineligibleTotal = 0;

      // Add main product price
      if (state?.mainProduct) {
        const price = state?.mainProduct?.selectedOption?.price || 0;
        total += price;

        if (
          state?.questionnaire?.eligibleProductIds?.includes(
            state?.mainProduct?.product?._id
          )
        ) {
          eligibleTotal += price;
        } else {
          ineligibleTotal += price;
        }
      }

      // Add related products prices
      state.relatedProducts?.forEach((relatedProduct) => {
        const price = relatedProduct?.selectedOption?.price || 0;
        total += price;

        if (
          state?.questionnaire?.eligibleProductIds?.includes(
            relatedProduct?.productId
          )
        ) {
          eligibleTotal += price;
        } else {
          ineligibleTotal += price;
        }
      });

      state.totalAmount = total;
      state.eligibleProductsTotal = eligibleTotal;
      state.ineligibleProductsTotal = ineligibleTotal;
    },

    // Set checkout step
    setCheckoutStep: (
      state,
      action: PayloadAction<CheckoutState["currentStep"]>
    ) => {
      state.currentStep = action.payload;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action?.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string>) => {
      state.error = action?.payload;
      state.isLoading = false;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear questionnaire data only
    clearQuestionnaireData: (state) => {
      state.questionnaire = initialQuestionnaireState;
      state.isFromQuestionnaire = false;
    },

    // Clear all checkout data
    clearCheckout: (state) => {
      state.mainProduct = null;
      state.relatedProducts = [];
      state.questionnaire = initialQuestionnaireState;
      state.totalAmount = 0;
      state.eligibleProductsTotal = 0;
      state.ineligibleProductsTotal = 0;
      state.isLoading = false;
      state.error = null;
      state.currentStep = "questionnaire";
      state.isFromQuestionnaire = false;
    },
  },
});

// Export actions
export const {
  setMainProduct,
  setRelatedProducts,
  addRelatedProduct,
  removeRelatedProduct,
  setQuestionnaireData,
  setGeneralEligibility,
  setProductResponses,
  addProductResponses,
  setProductEligibility,
  completeQuestionnaire,
  filterToEligibleProducts,
  calculateTotal,
  setCheckoutStep,
  setLoading,
  setError,
  clearError,
  clearQuestionnaireData,
  clearCheckout,
} = checkoutSlice.actions;

// Export types for use in components
export type {
  QuestionnaireResponse,
  ProductEligibility,
  QuestionnaireData,
  MainProduct,
  RelatedProduct,
  SelectedOption,
};

// Export reducer
export const checkoutReducer = checkoutSlice.reducer;
