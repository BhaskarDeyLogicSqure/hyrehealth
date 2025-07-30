import { useMemo, useState, useEffect } from "react";
import { useCheckout } from "./useCheckout";
import { Product } from "@/types/products";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  showSuccessToast,
  showErrorToast,
} from "@/components/GlobalErrorHandler";

interface ProductConfiguration {
  productId: string;
  dosageId: string;
  subscriptionDuration: string;
  isSelected: boolean;
}

const useOrderCheckout = ({
  product,
  selectedRelatedProducts,
}: {
  product: Product;
  selectedRelatedProducts: string[];
}) => {
  const router = useRouter();

  const { clearCheckout } = useCheckout();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");

  // State for managing all products (main + related) configurations
  const [productConfigurations, setProductConfigurations] = useState<
    ProductConfiguration[]
  >([]);

  // Get all eligible products (main product + related products)
  const allEligibleProducts = useMemo(() => {
    const products = [product];
    if (product?.similarProducts) {
      products.push(...product.similarProducts);
    }
    return products;
  }, [product]);

  // Initialize product configurations
  useEffect(() => {
    const initialConfigurations: ProductConfiguration[] =
      allEligibleProducts.map((prod) => {
        const defaultDosageOption = prod?.pricing?.subscriptionOptions?.find(
          (option) => option?.isDefault === true
        );

        return {
          productId: prod._id,
          dosageId: defaultDosageOption?._id || defaultDosageOption?.id || "",
          subscriptionDuration: "",
          isSelected:
            prod._id === product._id ||
            selectedRelatedProducts.includes(prod._id),
        };
      });

    setProductConfigurations(initialConfigurations);
  }, [allEligibleProducts, product._id, selectedRelatedProducts]);

  // Auto-select default duration when dosage is selected
  useEffect(() => {
    setProductConfigurations((prev) =>
      prev.map((config) => {
        if (config.dosageId && !config.subscriptionDuration) {
          const prod = allEligibleProducts.find(
            (p) => p._id === config.productId
          );
          if (prod?.pricing?.subscriptionOptions) {
            const selectedDosageStrength =
              prod.pricing.subscriptionOptions.find(
                (option) =>
                  option?._id === config.dosageId ||
                  option?.id === config.dosageId
              )?.strength;

            const defaultDurationOption = prod.pricing.subscriptionOptions.find(
              (option) =>
                option?.strength === selectedDosageStrength &&
                option?.isDefault === true
            );

            if (defaultDurationOption) {
              return {
                ...config,
                subscriptionDuration:
                  defaultDurationOption.duration?.value.toString() || "",
              };
            }
          }
        }
        return config;
      })
    );
  }, [allEligibleProducts]);

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
      const config = productConfigurations.find(
        (c) => c.productId === productId
      );
      if (!config?.dosageId) return [];

      const targetProduct = allEligibleProducts.find(
        (p) => p._id === productId
      );
      if (!targetProduct?.pricing?.subscriptionOptions) return [];

      const selectedDosageOptionStrength =
        targetProduct.pricing.subscriptionOptions.find(
          (option) =>
            option?._id === config.dosageId || option?.id === config.dosageId
        )?.strength;

      const durationOptions = targetProduct.pricing.subscriptionOptions
        ?.filter((option) => option?.strength === selectedDosageOptionStrength)
        ?.sort((a, b) => a?.duration?.value - b?.duration?.value);

      return durationOptions;
    };
  }, [productConfigurations, allEligibleProducts]);

  const _getSelectedDosageWithDuration = useMemo(() => {
    return (productId: string) => {
      const config = productConfigurations.find(
        (c) => c.productId === productId
      );
      if (!config?.dosageId || !config?.subscriptionDuration) return null;

      const targetProduct = allEligibleProducts.find(
        (p) => p._id === productId
      );
      if (!targetProduct?.pricing?.subscriptionOptions) return null;

      // get the strength of the selected dosage as this is used to filter the duration options
      const selectedDosageStrength =
        targetProduct.pricing.subscriptionOptions.find(
          (option) =>
            option?._id === config.dosageId || option?.id === config.dosageId
        )?.strength;

      // find the dosage that matches the selected dosage strength and duration
      return targetProduct.pricing.subscriptionOptions.find(
        (option) =>
          option?.strength === selectedDosageStrength &&
          option?.duration?.value === Number(config.subscriptionDuration)
      );
    };
  }, [productConfigurations, allEligibleProducts]);

  const _getTotalPrice = useMemo(() => {
    const selectedProducts = productConfigurations.filter(
      (config) => config.isSelected
    );

    const totalPrice = selectedProducts.reduce((total, config) => {
      const selectedOption = _getSelectedDosageWithDuration(config.productId);
      return total + (selectedOption?.price || 0);
    }, 0);

    return totalPrice;
  }, [productConfigurations, _getSelectedDosageWithDuration]);

  const _handleDosageAndSubscriptionDurationChange = (
    productId: string,
    type: "dosage" | "subscriptionDuration",
    value: any
  ) => {
    setProductConfigurations((prev) =>
      prev.map((config) => {
        if (config.productId === productId) {
          if (type === "dosage") {
            return {
              ...config,
              dosageId: value,
              subscriptionDuration: "", // Reset duration when dosage changes
            };
          } else if (type === "subscriptionDuration") {
            return {
              ...config,
              subscriptionDuration: value,
            };
          }
        }
        return config;
      })
    );
  };

  const _handleProductSelectionChange = (
    productId: string,
    isSelected: boolean
  ) => {
    // Ensure at least one product remains selected
    const currentlySelected = productConfigurations.filter(
      (config) => config.isSelected
    );
    if (currentlySelected.length === 1 && !isSelected) {
      alert("At least one product must remain selected");
      return;
    }

    setProductConfigurations((prev) =>
      prev.map((config) =>
        config.productId === productId ? { ...config, isSelected } : config
      )
    );
  };

  const _handleProceedToCheckout = async () => {
    const selectedProducts = productConfigurations.filter(
      (config) => config.isSelected
    );

    if (selectedProducts.length === 0) {
      alert("Please select at least one product");
      return;
    }

    // Validate all selected products have valid dosage and duration
    const invalidProducts = selectedProducts.filter(
      (config) =>
        !config.dosageId ||
        !config.subscriptionDuration ||
        !_getSelectedDosageWithDuration(config.productId)
    );

    if (invalidProducts.length > 0) {
      alert(
        "Please select valid dosage and duration for all selected products"
      );
      return;
    }

    setIsCheckoutLoading(true);

    try {
      // Prepare main product data (first selected product)
      const mainProductConfig =
        selectedProducts.find((config) => config.productId === product._id) ||
        selectedProducts[0];
      const mainProduct = allEligibleProducts.find(
        (p) => p._id === mainProductConfig.productId
      );
      const mainProductSelectedOption = _getSelectedDosageWithDuration(
        mainProductConfig.productId
      );

      const mainProductData = {
        product: mainProduct,
        selectedOption: {
          dosageId: mainProductConfig.dosageId,
          dosageStrength: mainProductSelectedOption?.strength || 0,
          duration: mainProductSelectedOption?.duration?.value || 0,
          price: mainProductSelectedOption?.price || 0,
        },
      };

      // Prepare related products data
      const relatedProductsData = selectedProducts
        .filter((config) => config.productId !== mainProductConfig.productId)
        .map((config) => {
          const relatedProduct = allEligibleProducts.find(
            (p) => p._id === config.productId
          );
          const selectedOption = _getSelectedDosageWithDuration(
            config.productId
          );

          return {
            productId: config.productId,
            product: relatedProduct,
            selectedOption: {
              dosageId: config.dosageId,
              dosageStrength: selectedOption?.strength || 0,
              duration: selectedOption?.duration?.value || 1,
              price: selectedOption?.price || 0,
            },
          };
        });

      // Dispatch data to Redux store
      //   setMainProduct(mainProductData);
      //   setRelatedProducts(relatedProductsData);
      //   calculateTotal();

      // Navigate to the next page
      router.push(`/pre-consultation?productId=${product?._id}`);
      // Clear any existing checkout data
      clearCheckout();
    } catch (error) {
      console.error("Error preparing checkout data:", error);
      alert("An error occurred while preparing checkout. Please try again.");
    } finally {
      // no need to set isCheckoutLoading to false as we are navigating to the next page
    }
  };

  // Get selected products
  const selectedProducts = productConfigurations.filter(
    (config) => config.isSelected
  );

  //   coupon code handling
  const _handleApplyCoupon = () => {
    if (couponCode?.trim()) {
      setAppliedCoupon(couponCode);
      setCouponCode("");
      showSuccessToast(`Coupon code "${couponCode}" applied successfully!`);
    } else {
      showErrorToast("Please enter a valid coupon code");
    }
  };

  const _handleClearCoupon = () => {
    if (appliedCoupon) {
      const removedCoupon = appliedCoupon;
      setAppliedCoupon("");
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

    if (result.isConfirmed) {
      _handleProductSelectionChange(productId, false);
      showSuccessToast(`"${productName}" has been removed from your order`);
    }
  };

  return {
    productConfigurations,
    selectedProducts,
    isCheckoutLoading,
    totalPrice: _getTotalPrice,
    couponCode,
    appliedCoupon,
    generateDosageOptions: _generateDosageOptions,
    generateSubscriptionDurationOptions: _generateSubscriptionDurationOptions,
    getSelectedDosageWithDuration: _getSelectedDosageWithDuration,
    handleDosageAndSubscriptionDurationChange:
      _handleDosageAndSubscriptionDurationChange,
    handleProductSelectionChange: _handleProductSelectionChange,
    handleProceedToCheckout: _handleProceedToCheckout,
    handleApplyCoupon: _handleApplyCoupon,
    handleClearCoupon: _handleClearCoupon,
    handleCouponCodeChange: _handleCouponCodeChange,
    handleDeleteProductAlert: _handleDeleteProductAlert,
  };
};

export default useOrderCheckout;
