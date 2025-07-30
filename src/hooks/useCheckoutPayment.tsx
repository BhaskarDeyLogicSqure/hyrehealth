"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { isValidEmail, isValidPhone, isValidPassword } from "@/lib/utils";
import { showErrorToast } from "@/components/GlobalErrorHandler";
import { formatDate } from "@/lib/dayjs";
const initialFormFields = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  streetAddress: "",
  city: "",
  state: "",
  zipCode: "",
  country: "US",
  cardNumber: "",
  expiryDate: "",
  cvv: "",
  cardholderName: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

const initialIsDirty = {
  firstName: false,
  lastName: false,
  email: false,
  phone: false,
  streetAddress: false,
  city: false,
  state: false,
  zipCode: false,
  country: false,
  cardNumber: false,
  expiryDate: false,
  cvv: false,
  cardholderName: false,
  password: false,
  confirmPassword: false,
  acceptTerms: false,
};

const useCheckoutDetails = () => {
  const searchParams = useSearchParams();

  const [formFields, setFormFields] =
    useState<Record<string, any>>(initialFormFields);
  const [isDirty, setIsDirty] =
    useState<Record<string, boolean>>(initialIsDirty);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const productId = searchParams?.get("product");
  const dosage = searchParams?.get("dosage");
  const duration = searchParams?.get("duration") || "1";
  const relatedProductIds =
    searchParams?.get("relatedProducts")?.split(",").filter(Boolean) || [];

  const [selectedRelatedProducts, setSelectedRelatedProducts] =
    useState<string[]>(relatedProductIds);
  const [isLoggedIn] = useState(false); // Mock login state

  // Mock product data
  const product = {
    name: "Semaglutide",
    dosages: [
      { value: "0.25mg", label: "0.25mg (Starting dose)", price: 299 },
      { value: "0.5mg", label: "0.5mg (Maintenance)", price: 349 },
      { value: "1.0mg", label: "1.0mg (Maximum)", price: 399 },
    ],
  };

  // Mock related products data
  const relatedProductsData = [
    { id: "2", name: "B12 Injection", price: 99 },
    { id: "3", name: "Tirzepatide", price: 399 },
  ];

  const selectedDosagePrice =
    product?.dosages?.find((d) => d?.value === dosage)?.price || 299;
  const relatedProductsTotal = selectedRelatedProducts?.reduce(
    (total, productId) => {
      const relatedProduct = relatedProductsData?.find(
        (p) => p?.id === productId
      );
      return total + (relatedProduct?.price || 0);
    },
    0
  );
  const totalPrice =
    (selectedDosagePrice + relatedProductsTotal) * parseInt(duration);

  const _handleOnChange = (field: string, value: string | boolean) => {
    const newFormFields = { ...formFields };
    const newIsDirty = { ...isDirty };

    newFormFields[field] = value;
    newIsDirty[field] = true;

    setFormFields(newFormFields);
    setIsDirty(newIsDirty);

    _validateForm({ newFormFields, newIsDirty });
  };

  const _validateForm = ({
    newFormFields,
    newIsDirty,
  }: {
    newFormFields: Record<string, any>;
    newIsDirty: Record<string, boolean>;
  }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const newErrors: Record<string, string | null> = { ...errors };
        let isFormValid = true;

        Object.keys(newFormFields)?.forEach((key) => {
          if (newIsDirty?.[key]) {
            switch (key) {
              // basic info form validation
              case "firstName":
              case "lastName": {
                if (!newFormFields?.[key]?.trim()?.length) {
                  newErrors[key] = "*First name is required";
                  isFormValid = false;
                } else {
                  newErrors[key] = null;
                  newIsDirty[key] = false;
                }
                break;
              }

              case "email": {
                if (!newFormFields?.[key]?.trim()?.length) {
                  newErrors[key] = "*Email is required";
                  isFormValid = false;
                } else if (!isValidEmail(newFormFields?.[key])) {
                  newErrors[key] = "*Invalid email address";
                  isFormValid = false;
                } else {
                  newErrors[key] = null;
                  newIsDirty[key] = false;
                }
                break;
              }

              case "phone": {
                if (!newFormFields?.[key]?.trim()?.length) {
                  newErrors[key] = "*Phone is required";
                  isFormValid = false;
                } else if (!isValidPhone(newFormFields?.[key])) {
                  newErrors[key] = "*Invalid phone number";
                  isFormValid = false;
                } else {
                  newErrors[key] = null;
                  newIsDirty[key] = false;
                }
                break;
              }

              case "dob": {
                if (!newFormFields?.[key]?.trim()?.length) {
                  newErrors[key] = "*Date of birth is required";
                  isFormValid = false;
                } else {
                  newErrors[key] = null;
                  newIsDirty[key] = false;
                }
                break;
              }

              // billing address form validation
              case "streetAddress":
              case "city":
              case "state":
              case "zipCode":
              case "country": {
                if (!newFormFields?.[key]?.trim()?.length) {
                  newErrors[key] = `*Required`;
                  isFormValid = false;
                } else {
                  newErrors[key] = null;
                  newIsDirty[key] = false;
                }
                break;
              }

              // payment info form validation
              case "cardNumber":
              case "expiryDate":
              case "cvv":
              case "cardholderName": {
                if (!newFormFields?.[key]?.trim()?.length) {
                  newErrors[key] = `*Required`;
                  isFormValid = false;
                } else {
                  newErrors[key] = null;
                  newIsDirty[key] = false;
                }
                break;
              }

              // account creation form validation
              case "password":
              case "confirmPassword": {
                if (!newFormFields?.[key]?.trim()?.length) {
                  newErrors[key] = `*Required`;
                  isFormValid = false;
                } else if (!isValidPassword(newFormFields?.[key])) {
                  newErrors[key] =
                    "*Password must be at least 8 characters, include a letter, a number, and a special character";
                  isFormValid = false;
                } else if (
                  key === "confirmPassword" &&
                  newFormFields?.[key] !== newFormFields?.["password"]
                ) {
                  newErrors[key] = "*Passwords do not match";
                  isFormValid = false;
                } else {
                  newErrors[key] = null;
                  newIsDirty[key] = false;
                }
                break;
              }
            }
          }
        });

        setErrors(newErrors);
        setIsDirty(newIsDirty);

        resolve(isFormValid);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  };

  const _handleRemoveRelatedProduct = (productId: string) => {
    setSelectedRelatedProducts((prev) =>
      prev?.filter((id) => id !== productId)
    );
  };

  const _markAllIsDirty = () => {
    const newIsDirty = { ...isDirty };
    Object.keys(newIsDirty)?.forEach((key) => {
      newIsDirty[key] = true;
    });
    setIsDirty(newIsDirty);
    return newIsDirty;
  };

  const _handleGetPayload = async (e: React.FormEvent) => {
    return new Promise(async (resolve, reject) => {
      if (e) e.preventDefault();

      // if (!isLoggedIn && formFields?.password !== formFields?.confirmPassword) {
      //   showErrorToast("Passwords do not match");
      //   return;
      // }

      const newFormFields = { ...formFields };
      const newIsDirty = _markAllIsDirty();

      const isFormValid = await _validateForm({ newFormFields, newIsDirty });
      console.log("isFormValid", isFormValid);

      // return if form is not valid
      if (!isFormValid) {
        reject(new Error("Form is not valid"));
        return;
      }

      if (!formFields?.acceptTerms) {
        showErrorToast("Please accept the terms and conditions");
        return;
      }

      const payload = {
        firstName: newFormFields?.firstName,
        lastName: newFormFields?.lastName,
        email: newFormFields?.email,
        phone: newFormFields?.phone,
        dob: newFormFields?.dob
          ? formatDate(newFormFields.dob, "YYYY-MM-DD")
          : undefined,
        streetAddress: newFormFields?.streetAddress,

        productId,
        dosage,
        duration,
        relatedProducts: selectedRelatedProducts,
      };

      console.log("payload", payload);

      // Mock successful checkout
      // console.log("Checkout submitted:", formFields);

      // toast({
      //   title: "Order Placed Successfully",
      //   description: "Your order is being processed.",
      // });

      // // Navigate to thank you page
      // const relatedProductsParam =
      //   selectedRelatedProducts.length > 0
      //     ? `&relatedProducts=${selectedRelatedProducts.join(",")}`
      //     : "";
      // router.push(
      //   `/thank-you?total=${totalPrice + CONSULTATION_FEE}${relatedProductsParam}`
      // );

      resolve(payload || {});
    });
  };

  return {
    formFields,
    errors,
    selectedDosagePrice,
    relatedProductsTotal,
    totalPrice,
    product,
    relatedProductsData,
    selectedRelatedProducts,
    duration,
    handleOnChange: _handleOnChange,
    handleRemoveRelatedProduct: _handleRemoveRelatedProduct,
    handleGetPayload: _handleGetPayload,
  };
};

export default useCheckoutDetails;
