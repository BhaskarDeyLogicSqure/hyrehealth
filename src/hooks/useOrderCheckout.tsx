import { useMemo, useState, useEffect } from "react";
import { Product } from "@/types/products";
import Swal from "sweetalert2";
import {
  showSuccessToast,
  showErrorToast,
} from "@/components/GlobalErrorHandler";
import useChekoutApi from "@/api/checkout/useChekoutApi";

interface ProductConfiguration {
  productId: string;
  dosageId: string; // this is the subscription option id
  subscriptionDuration: string;
  strength: number;
}

const useOrderCheckout = ({
  product,
  initialMainProductSelectedOption,
  selectedRelatedProducts,
}: {
  product: Product | null;
  initialMainProductSelectedOption: any;
  selectedRelatedProducts: Product[];
}) => {
  const { validateCoupon, isValidateCouponLoading, isValidateCouponError } =
    useChekoutApi();

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    type: "percentage" | "fixed_amount" | "";
  }>({
    code: "",
    discount: 0,
    type: "",
  });

  // State for managing all products (main + related) configurations
  const [productConfigurations, setProductConfigurations] = useState<
    ProductConfiguration[]
  >([]);

  // Get all eligible products (main product + related products)
  const allEligibleProducts = useMemo(() => {
    const products: Product[] = [];
    if (product) {
      products?.push(product);
    }
    if (selectedRelatedProducts) {
      products?.push(...selectedRelatedProducts);
    }
    return products;
  }, [product, selectedRelatedProducts]);

  // Initialize product configurations
  useEffect(() => {
    const initialConfigurations: ProductConfiguration[] = [];

    // Add main product
    const mainProduct = allEligibleProducts?.find(
      (p) => p?._id === product?._id
    );

    if (mainProduct) {
      initialConfigurations?.push({
        productId: mainProduct?._id,
        dosageId:
          initialMainProductSelectedOption?.dosageId ||
          initialMainProductSelectedOption?.id ||
          "",
        subscriptionDuration:
          initialMainProductSelectedOption?.duration?.toString() || "",
        strength: initialMainProductSelectedOption?.dosageStrength || 0,
      });
    }

    // Add selected related products
    selectedRelatedProducts?.forEach((relatedProduct) => {
      if (relatedProduct) {
        // in case of related products, we need to get the default dosage option as from product details page, we are sending the product with default dosage option only
        const defaultDosageOption =
          relatedProduct?.pricing?.subscriptionOptions?.find(
            (option) => option?.isDefault === true
          );

        initialConfigurations?.push({
          productId: relatedProduct?._id,
          dosageId: defaultDosageOption?._id || defaultDosageOption?.id || "",
          subscriptionDuration:
            defaultDosageOption?.duration?.value?.toString() || "",
          strength: defaultDosageOption?.strength || 0,
        });
      }
    });

    setProductConfigurations(initialConfigurations);
  }, [allEligibleProducts, product?._id, selectedRelatedProducts]);

  const _generateDosageOptions = useMemo(() => {
    return (productId: string) => {
      const targetProduct = allEligibleProducts?.find(
        (p) => p?._id === productId
      );
      if (!targetProduct?.pricing?.subscriptionOptions) return [];

      // Extract unique strength options from subscriptionOptions
      const seenStrengths = new Set();
      const dosageOptions = targetProduct?.pricing?.subscriptionOptions
        // filter out options with the same strength
        ?.filter((option) => {
          if (!option?.strength || seenStrengths?.has(option?.strength))
            return false;
          seenStrengths?.add(option?.strength);
          return true;
        })
        ?.sort((a, b) => a?.strength - b?.strength) // sort by strength in ascending order
        ?.map((option) => ({
          id: option?.id || option?._id,
          name: `${option?.strength}mg`,
        }));

      return dosageOptions;
    };
  }, [allEligibleProducts]);

  const _generateSubscriptionDurationOptions = useMemo(() => {
    return (productId: string) => {
      const config = productConfigurations?.find(
        (c) => c?.productId === productId
      );
      if (!config?.dosageId) return [];

      const targetProduct = allEligibleProducts?.find(
        (p) => p?._id === productId
      );
      if (!targetProduct?.pricing?.subscriptionOptions) return [];

      const selectedDosageOptionStrength =
        targetProduct?.pricing?.subscriptionOptions?.find(
          (option) =>
            option?._id === config?.dosageId || option?.id === config?.dosageId
        )?.strength;

      const durationOptions = targetProduct?.pricing?.subscriptionOptions
        ?.filter((option) => option?.strength === selectedDosageOptionStrength)
        ?.sort((a, b) => a?.duration?.value - b?.duration?.value);

      return durationOptions;
    };
  }, [productConfigurations, allEligibleProducts]);

  const _getSelectedDosageWithDuration = useMemo(() => {
    return (productId: string) => {
      const config = productConfigurations?.find(
        (c) => c?.productId === productId
      );
      if (!config?.dosageId || !config?.subscriptionDuration) return null;

      // first find the product from the allEligibleProducts array using the productId provided
      const targetProduct = allEligibleProducts?.find(
        (p) => p?._id === productId
      );

      // if product pricing is not present, return null
      if (!targetProduct?.pricing?.subscriptionOptions) return null;

      // get the strength of the selected dosage as this is used to filter the duration options
      const selectedDosageStrength =
        targetProduct?.pricing?.subscriptionOptions?.find(
          (option) =>
            option?._id === config?.dosageId || option?.id === config?.dosageId
        )?.strength;

      // find and return the dosage that matches the selected dosage strength and duration
      return targetProduct?.pricing?.subscriptionOptions?.find(
        (option) =>
          option?.strength === selectedDosageStrength &&
          option?.duration?.value === Number(config?.subscriptionDuration)
      );
    };
  }, [productConfigurations, allEligibleProducts]);

  const _getTotalPrice = useMemo(() => {
    const totalPrice = productConfigurations?.reduce((total, config) => {
      const selectedOption = _getSelectedDosageWithDuration(config?.productId);
      return total + (selectedOption?.price || 0);
    }, 0);

    return totalPrice;
  }, [productConfigurations, _getSelectedDosageWithDuration]);

  const _getDiscountedTotalPrice = useMemo(() => {
    const totalPrice = _getTotalPrice;

    // if coupon type is percentage, apply percentage discount
    if (appliedCoupon?.type === "percentage") {
      const discount = appliedCoupon?.discount || 0;
      const discountedPrice = totalPrice - (totalPrice * discount) / 100;
      return discountedPrice; // return the discounted price
    } else if (appliedCoupon?.type === "fixed_amount") {
      // if coupon type is fixed amount, apply fixed amount discount
      const discount = appliedCoupon?.discount || 0;
      const discountedPrice = totalPrice - discount;
      return discountedPrice; // return the discounted price
    }

    // if coupon type is not set, return the total price
    return totalPrice;
  }, [_getTotalPrice, appliedCoupon]);

  const _handleDosageAndSubscriptionDurationChange = (
    productId: string,
    type: "dosage" | "subscriptionDuration",
    value: any
  ) => {
    const newProductConfigurations = [...productConfigurations];

    const updatedProductConfigurations = newProductConfigurations?.map(
      (config) => {
        if (config?.productId === productId) {
          if (type === "dosage") {
            // Find the strength for the selected dosage

            // first find the product from the allEligibleProducts array using the productId provided
            const targetProduct = allEligibleProducts?.find(
              (p) => p?._id === productId
            );

            // find the dosage option that matches the selected dosage strength
            const selectedOption =
              targetProduct?.pricing?.subscriptionOptions?.find(
                (option) => option?._id === value || option?.id === value
              );

            return {
              ...config,
              dosageId: value,
              // subscriptionDuration: "", // Reset duration when dosage changes
              strength: selectedOption?.strength || config?.strength,
            };
          } else if (type === "subscriptionDuration") {
            return {
              ...config,
              subscriptionDuration: value,
            };
          }
        }
        return config;
      }
    );

    setProductConfigurations(updatedProductConfigurations);
  };

  const _handleRemoveProduct = (productId: string) => {
    // Ensure at least one product remains (main product should always be there)
    const remainingProducts = productConfigurations?.filter(
      (config) => config?.productId !== productId
    );

    if (remainingProducts?.length === 0) {
      alert("At least one product must remain selected");
      return;
    }

    setProductConfigurations(remainingProducts);
  };

  const _handleApplyCoupon = async () => {
    try {
      const coupon = couponCode?.trim();

      if (coupon) {
        // check for valid coupon code
        const isValidCouponCode = !coupon?.includes(" "); // we are not allowing spaces in the coupon code, can add more checks if needed

        if (!isValidCouponCode) {
          showErrorToast("Please enter a valid coupon code");
          return;
        }

        const response = await validateCoupon(coupon);

        if (!isValidateCouponError) {
          setAppliedCoupon({
            code: coupon,
            discount: response?.data?.coupon?.value || 0,
            type: response?.data?.coupon?.type || "",
          });
          setCouponCode("");
          showSuccessToast(`Coupon code "${coupon}" applied successfully!`);
        }
      } else {
        showErrorToast("Please enter a valid coupon code");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setCouponCode("");
    }
  };

  const _handleClearCoupon = () => {
    if (appliedCoupon) {
      const removedCoupon = appliedCoupon;
      setAppliedCoupon({
        code: "",
        discount: 0,
        type: "",
      });
      showSuccessToast(`Coupon code "${removedCoupon}" has been removed`);
    }
  };

  const _handleCouponCodeChange = (e: any) => {
    setCouponCode(e.target.value);
  };

  const _handleDeleteProductAlert = async (
    productId: string,
    productName: string
  ) => {
    const result = await Swal.fire({
      title: "Remove Product",
      text: `Are you sure you want to remove "${productName}" from your order?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
    });

    if (result?.isConfirmed) {
      _handleRemoveProduct(productId);
      showSuccessToast(`"${productName}" has been removed from your order`);
    }
  };

  return {
    productConfigurations,
    selectedProducts: productConfigurations, // Now all configurations are selected products
    isCheckoutLoading,
    isValidateCouponLoading,
    totalPrice: _getTotalPrice,
    discountedTotalPrice: _getDiscountedTotalPrice,
    couponCode,
    appliedCoupon,
    setIsCheckoutLoading,
    generateDosageOptions: _generateDosageOptions,
    generateSubscriptionDurationOptions: _generateSubscriptionDurationOptions,
    getSelectedDosageWithDuration: _getSelectedDosageWithDuration,
    handleDosageAndSubscriptionDurationChange:
      _handleDosageAndSubscriptionDurationChange,
    handleRemoveProduct: _handleRemoveProduct,
    handleApplyCoupon: _handleApplyCoupon,
    handleClearCoupon: _handleClearCoupon,
    handleCouponCodeChange: _handleCouponCodeChange,
    handleDeleteProductAlert: _handleDeleteProductAlert,
  };
};

export default useOrderCheckout;
