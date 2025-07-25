"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useToast } from "./use-toast";
import { useState } from "react";
import { isValidDate, isValidEmail, isValidPhone } from "@/lib/utils";

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

const useCheckoutPayment = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [formFields, setFormFields] =
    useState<Record<string, any>>(initialFormFields);
  const [isDirty, setIsDirty] =
    useState<Record<string, boolean>>(initialIsDirty);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const productId = searchParams.get("product");
  const dosage = searchParams.get("dosage");
  const duration = searchParams.get("duration") || "1";
  const relatedProductIds =
    searchParams.get("relatedProducts")?.split(",").filter(Boolean) || [];

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
    product.dosages.find((d) => d.value === dosage)?.price || 299;
  const relatedProductsTotal = selectedRelatedProducts.reduce(
    (total, productId) => {
      const relatedProduct = relatedProductsData.find(
        (p) => p.id === productId
      );
      return total + (relatedProduct?.price || 0);
    },
    0
  );
  const totalPrice =
    (selectedDosagePrice + relatedProductsTotal) * parseInt(duration);
  const consultationFee = 49;

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
    const newErrors: Record<string, string | null> = { ...errors };
    let isFormValid = true;

    Object.keys(newFormFields).forEach((key) => {
      if (newIsDirty?.[key]) {
        switch (key) {
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
            } else if (!isValidDate(newFormFields?.[key])) {
              newErrors[key] = "*Invalid date of birth";
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

    return isFormValid;
  };

  const handleRemoveRelatedProduct = (productId: string) => {
    setSelectedRelatedProducts((prev) => prev.filter((id) => id !== productId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formFields?.acceptTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    if (!isLoggedIn && formFields?.password !== formFields?.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    // Mock successful checkout
    console.log("Checkout submitted:", formFields);

    toast({
      title: "Order Placed Successfully",
      description: "Your order is being processed.",
    });

    // Navigate to thank you page
    const relatedProductsParam =
      selectedRelatedProducts.length > 0
        ? `&relatedProducts=${selectedRelatedProducts.join(",")}`
        : "";
    router.push(
      `/thank-you?total=${totalPrice + consultationFee}${relatedProductsParam}`
    );
  };

  console.log("formFields", formFields);
  console.log("isDirty", isDirty);
  console.log("errors", errors);
  return {
    formFields,
    errors,
    selectedDosagePrice,
    relatedProductsTotal,
    totalPrice,
    consultationFee,
    product,
    relatedProductsData,
    selectedRelatedProducts,
    duration,
    handleSubmit,
    handleOnChange: _handleOnChange,
    handleRemoveRelatedProduct,
  };
};

export default useCheckoutPayment;
