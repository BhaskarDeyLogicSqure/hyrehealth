import { useAppSelector, useAppDispatch } from "@/hooks/useAppDispatch";
import {
  setMainProduct,
  setRelatedProducts,
  addRelatedProduct,
  removeRelatedProduct,
  calculateTotal,
  setLoading,
  setError,
  clearError,
  clearCheckout,
  CheckoutState,
  ProductEligibility,
  setProductEligibility,
  updateFormData,
  setOnCheckoutPage,
  clearFormData,
} from "@/store/slices/checkoutSlice";

// Import the action payload types from the slice
type MainProduct = NonNullable<CheckoutState["mainProduct"]>;
type RelatedProduct = CheckoutState["relatedProducts"][0];

export const useCheckout = () => {
  const dispatch = useAppDispatch();
  const checkoutState = useAppSelector((state) => state.checkoutReducer);

  return {
    // State
    ...checkoutState,

    // Actions
    setMainProduct: (product: MainProduct) => dispatch(setMainProduct(product)),
    setRelatedProducts: (products: RelatedProduct[]) =>
      dispatch(setRelatedProducts(products)),
    addRelatedProduct: (product: RelatedProduct) =>
      dispatch(addRelatedProduct(product)),
    removeRelatedProduct: (productId: string) =>
      dispatch(removeRelatedProduct(productId)),
    calculateTotal: () => dispatch(calculateTotal()),
    setLoading: (loading: boolean) => dispatch(setLoading(loading)),
    setError: (error: string) => dispatch(setError(error)),
    clearError: () => dispatch(clearError()),
    clearCheckout: () => dispatch(clearCheckout()),
    setProductEligibility: (eligibilityData: ProductEligibility) =>
      dispatch(setProductEligibility(eligibilityData)),

    // Form data actions
    updateFormData: (formData: Partial<CheckoutState["formData"]>) =>
      dispatch(updateFormData(formData)),
    setOnCheckoutPage: (isOnPage: boolean) =>
      dispatch(setOnCheckoutPage(isOnPage)),
    clearFormData: () => dispatch(clearFormData()),
  };
};
