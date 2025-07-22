import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/products";

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

// Define the checkout state interface
export interface CheckoutState {
  mainProduct: MainProduct | null;
  relatedProducts: RelatedProduct[];
  totalAmount: number;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: CheckoutState = {
  mainProduct: null,
  relatedProducts: [],
  totalAmount: 0,
  isLoading: false,
  error: null,
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
      const existingIndex = state.relatedProducts.findIndex(
        (item) => item.productId === action?.payload?.productId
      );

      if (existingIndex >= 0) {
        // Update existing product
        state.relatedProducts[existingIndex] = action?.payload;
      } else {
        // Add new product
        state.relatedProducts.push(action?.payload);
      }
      state.error = null;
    },

    // Remove a related product
    removeRelatedProduct: (state, action: PayloadAction<string>) => {
      state.relatedProducts = state.relatedProducts.filter(
        (item) => item.productId !== action?.payload
      );
      state.error = null;
    },

    // Calculate and set total amount
    calculateTotal: (state) => {
      let total = 0;

      // Add main product price
      if (state?.mainProduct) {
        total += state?.mainProduct?.selectedOption?.price;
      }

      // Add related products prices
      state.relatedProducts.forEach((relatedProduct) => {
        total += relatedProduct?.selectedOption?.price;
      });

      state.totalAmount = total;
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

    // Clear all checkout data
    clearCheckout: (state) => {
      state.mainProduct = null;
      state.relatedProducts = [];
      state.totalAmount = 0;
      state.isLoading = false;
      state.error = null;
    },
  },
});

// Export actions
export const {
  setMainProduct,
  setRelatedProducts,
  addRelatedProduct,
  removeRelatedProduct,
  calculateTotal,
  setLoading,
  setError,
  clearError,
  clearCheckout,
} = checkoutSlice.actions;

// Export reducer
export const checkoutReducer = checkoutSlice.reducer;
