import { useMemo, useState, useEffect } from "react";
import { useCheckout } from "./useCheckout";
import { Product } from "@/types/products";
import { useRouter } from "next/navigation";

const useProductPurchaseSection = ({
  product,
  selectedRelatedProducts,
  relatedProductsTotal,
}: {
  product: Product;
  selectedRelatedProducts: string[];
  relatedProductsTotal: number;
}) => {
  const router = useRouter();
  const { setMainProduct, setRelatedProducts, calculateTotal, clearCheckout } =
    useCheckout();
  const [selectedDosageId, setSelectedDosageId] = useState<string>("");
  const [subscriptionDuration, setSubscriptionDuration] = useState<string>("");
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const _generateDosageOptions = useMemo(() => {
    // Extract unique strength options from subscriptionOptions
    const seenStrengths = new Set();
    const dosageOptions = product?.pricing?.subscriptionOptions
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
  }, [product]);

  const _generateSubscriptionDurationOptions = useMemo(() => {
    // Find the strength of the selected dosage option
    const selectedDosageOptionStrength =
      product?.pricing?.subscriptionOptions?.find(
        (option) => option?._id === selectedDosageId
      )?.strength;

    // Filter options by selected strength and exclude those with price === 0
    const durationOptions = product?.pricing?.subscriptionOptions
      ?.filter(
        (option) =>
          option?.strength === selectedDosageOptionStrength &&
          option?.price !== 0 // Exclude options where price is exactly 0
      )
      // Sort by duration value in ascending order
      ?.sort((a, b) => a?.duration?.value - b?.duration?.value);

    return durationOptions;
  }, [selectedDosageId, product]);

  const selectedDosageWithDuration = useMemo(() => {
    if (!selectedDosageId || !subscriptionDuration) return null;

    // get the strength of the selected dosage as this is used to filter the duration options
    const selectedDosageStrength = product?.pricing?.subscriptionOptions?.find(
      (option) => option?._id === selectedDosageId
    )?.strength;

    // find the dosage that matches the selected dosage strength and duration
    return product?.pricing?.subscriptionOptions?.find(
      (option) =>
        option?.strength === selectedDosageStrength &&
        option?.duration?.value === Number(subscriptionDuration)
    );
  }, [selectedDosageId, subscriptionDuration, product]);

  const _getTotalPrice = useMemo(() => {
    // total price = price of selected dosage * duration + total price of related products
    const totalPrice =
      selectedDosageWithDuration?.price + relatedProductsTotal || 0;

    return totalPrice;
  }, [selectedDosageWithDuration, relatedProductsTotal]);

  const _handleDosageAndSubscriptionDurationChange = (
    type: "dosage" | "subscriptionDuration",
    value: any
  ) => {
    if (type === "dosage") {
      setSelectedDosageId(value);
      setSubscriptionDuration("");
    } else if (type === "subscriptionDuration") {
      setSubscriptionDuration(value);
    }
  };

  const _handleProceedToCheckout = async () => {
    if (!selectedDosageId || !subscriptionDuration) {
      alert("Please select a dosage first");
      return;
    }

    if (!selectedDosageWithDuration) {
      alert("Please select valid dosage and duration");
      return;
    }

    setIsCheckoutLoading(true);

    try {
      // Clear any existing checkout data
      clearCheckout();

      // Prepare main product data for Redux store
      const mainProductData = {
        product,
        selectedOption: {
          dosageId: selectedDosageId,
          dosageStrength: selectedDosageWithDuration?.strength || 0,
          duration: selectedDosageWithDuration?.duration?.value || 0,
          price: selectedDosageWithDuration?.price || 0,
        },
      };

      // Prepare related products data for Redux store
      // Note: The related products data with default dosage/duration is already
      // prepared in ProductSection component, so we just need to convert the
      // selectedRelatedProducts array to the format expected by Redux
      const relatedProductsData = selectedRelatedProducts
        ?.map((productId: any) => {
          const relatedProduct = product?.similarProducts?.find(
            (p: any) => p?._id === productId
          );

          if (!relatedProduct) return null;

          // Find default dosage and duration options
          const defaultDosageOption =
            relatedProduct?.pricing?.subscriptionOptions?.find(
              (option: any) => option?.isDefault === true
            );

          if (!defaultDosageOption) {
            // Fallback to first option or base price
            const firstOption =
              relatedProduct?.pricing?.subscriptionOptions?.[0];
            return {
              productId,
              product: relatedProduct,
              selectedOption: {
                dosageId: firstOption?._id || firstOption?.id || "",
                dosageStrength: firstOption?.strength || 0,
                duration: firstOption?.duration?.value || 1,
                price:
                  firstOption?.price || relatedProduct.pricing?.basePrice || 0,
              },
            };
          }

          // Find default duration for the selected dosage
          const defaultDurationOption =
            relatedProduct?.pricing?.subscriptionOptions?.find(
              (option: any) =>
                option?.strength === defaultDosageOption.strength &&
                option?.isDefault === true
            );

          return {
            productId,
            product: relatedProduct,
            selectedOption: {
              dosageId: defaultDosageOption._id || defaultDosageOption.id,
              dosageStrength: defaultDosageOption.strength,
              duration:
                defaultDurationOption?.duration?.value ||
                defaultDosageOption?.duration?.value ||
                1,
              price:
                defaultDurationOption?.price ||
                defaultDosageOption?.price ||
                relatedProduct.pricing?.basePrice ||
                0,
            },
          };
        })
        ?.filter(
          (item: any): item is NonNullable<typeof item> => item !== null
        ); // Type-safe filter to remove null values

      // Dispatch data to Redux store
      setMainProduct(mainProductData);
      setRelatedProducts(relatedProductsData);
      calculateTotal();

      // Simulate processing time for better UX
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate to eligibility questionnaire with productId and relatedProducts if any
      router.push(
        `/eligibility-questionnaire?productId=${product?._id}${
          selectedRelatedProducts && selectedRelatedProducts?.length > 0
            ? `&relatedProducts=${selectedRelatedProducts?.join(",")}`
            : ""
        }`
      );
    } catch (error) {
      console.error("Error preparing checkout data:", error);
      alert("An error occurred while preparing checkout. Please try again.");
    } finally {
      // no need to set isCheckoutLoading to false as we are navigating to the next page, so it will be reset on page change
      // setIsCheckoutLoading(false);
    }
  };

  // Auto-select default dosage when component mounts or product changes
  useEffect(() => {
    if (product?.pricing?.subscriptionOptions && !selectedDosageId) {
      // Find the default dosage option
      const defaultDosageOption = product?.pricing?.subscriptionOptions?.find(
        (option) => option?.isDefault === true
      );

      if (defaultDosageOption) {
        setSelectedDosageId(defaultDosageOption._id || defaultDosageOption.id);
      }
    }
  }, [product, selectedDosageId]);

  // Auto-select default duration when dosage is selected
  useEffect(() => {
    if (selectedDosageId && product?.pricing?.subscriptionOptions) {
      const selectedDosageStrength =
        product?.pricing?.subscriptionOptions?.find(
          (option) =>
            option?._id === selectedDosageId || option?.id === selectedDosageId
        )?.strength;

      // Find default duration option for the selected dosage strength
      const defaultDurationOption = product?.pricing?.subscriptionOptions?.find(
        (option) =>
          option?.strength === selectedDosageStrength &&
          option?.isDefault === true
      );

      if (defaultDurationOption && !subscriptionDuration) {
        setSubscriptionDuration(
          defaultDurationOption.duration?.value.toString()
        );
      }
    }
  }, [selectedDosageId, product, subscriptionDuration]);

  return {
    selectedDosageId,
    subscriptionDuration,
    isCheckoutLoading,
    generateDosageOptions: _generateDosageOptions,
    generateSubscriptionDurationOptions: _generateSubscriptionDurationOptions,
    getTotalPrice: _getTotalPrice,
    selectedDosageWithDuration,
    handleDosageAndSubscriptionDurationChange:
      _handleDosageAndSubscriptionDurationChange,
    handleProceedToCheckout: _handleProceedToCheckout,
  };
};

export default useProductPurchaseSection;
