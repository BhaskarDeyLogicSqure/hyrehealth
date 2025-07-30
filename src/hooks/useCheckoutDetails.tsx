"use client";

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
  const [formFields, setFormFields] =
    useState<Record<string, any>>(initialFormFields);
  const [isDirty, setIsDirty] =
    useState<Record<string, boolean>>(initialIsDirty);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

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
        // basic info
        firstName: newFormFields?.firstName || undefined,
        lastName: newFormFields?.lastName || undefined,
        email: newFormFields?.email || undefined,
        phone: newFormFields?.phone || undefined,
        dob: newFormFields?.dob
          ? formatDate(newFormFields.dob, "YYYY-MM-DD")
          : undefined,

        // billing address
        billingAddress: {
          street: newFormFields?.streetAddress || undefined,
          city: newFormFields?.city || undefined,
          state: newFormFields?.state || undefined,
          zipCode: newFormFields?.zipCode || undefined,
          country: newFormFields?.country || undefined,
        },

        // password
        password: newFormFields?.password || undefined,

        // payment info
        paymentInfo: {
          // product related info
          products: [], // will be populated on useOrderCheckout hook at the time of checkout
          // payment and card related info
          finalAmount: 0, // will be populated on useOrderCheckout hook at the time of checkout
          couponCode: "", // will be populated on useOrderCheckout hook at the time of checkout
          paymentMethod: "newFormFields?.paymentMethod", // TODO: add payment method field when work on payment gateway
          cardLast4: "newFormFields?.cardLast4", // TODO: add card last 4 digits when work on payment gateway
          cardBrand: "newFormFields?.cardBrand", // TODO: add card brand when work on payment gateway
        },
      };

      console.log("payload", payload);
      resolve(payload || {});
    });
  };

  return {
    formFields,
    errors,
    handleOnChange: _handleOnChange,
    handleGetPayload: _handleGetPayload,
  };
};

export default useCheckoutDetails;
