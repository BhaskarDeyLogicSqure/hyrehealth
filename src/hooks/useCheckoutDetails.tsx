"use client";

import { useState } from "react";
import { isValidEmail, isValidPhone, isValidPassword } from "@/lib/utils";
import { showErrorToast } from "@/components/GlobalErrorHandler";
import { formatDate } from "@/lib/dayjs";
import { isUserAuthenticated } from "@/utils/auth";
import { REGEX_CONFIG } from "@/configs/regexConfig";
import { useCheckout } from "@/hooks/useCheckout";
const initialFormFields = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  streetAddress: "",
  addressLine2: "",
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
  // NMI Payment fields
  paymentToken: "",
  paymentMethod: "",
  cardType: "",
  cardLast4: "",
};

const initialIsDirty = {
  firstName: false,
  lastName: false,
  email: false,
  phone: false,
  streetAddress: false,
  addressLine2: false,
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
  // NMI Payment fields
  paymentToken: false,
  paymentMethod: false,
  cardType: false,
  cardLast4: false,
};

const useCheckoutDetails = () => {
  const isLoggedIn = isUserAuthenticated();
  const { formData, updateFormData } = useCheckout();

  const [isDirty, setIsDirty] =
    useState<Record<string, boolean>>(initialIsDirty);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  // Use Redux form data as the source of truth
  const formFields = formData;

  const _handleOnChange = (field: string, value: string | boolean) => {
    const newIsDirty = { ...isDirty };
    newIsDirty[field] = true;

    // Update Redux store with the new form data
    updateFormData({ [field]: value });
    setIsDirty(newIsDirty);

    // Validate with updated form data
    const updatedFormFields = { ...formFields, [field]: value };
    _validateForm({ newFormFields: updatedFormFields, newIsDirty });
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
                // if user is not logged in, validate basic info fields
                if (!isLoggedIn) {
                  if (
                    key === "firstName" &&
                    !newFormFields?.[key]?.trim()?.length
                  ) {
                    newErrors[key] = "*First name is required";
                    isFormValid = false;
                  } else if (
                    // check if the name has special characters / numbers
                    /[^a-zA-Z\s'-]/?.test(newFormFields?.[key] || "")
                  ) {
                    newErrors[key] =
                      "*Special characters and numbers are not allowed";
                    isFormValid = false;
                  } else if (
                    (key === "firstName" ||
                      (key === "lastName" &&
                        newFormFields?.[key]?.trim()?.length)) &&
                    (newFormFields?.[key]?.trim()?.length < 2 ||
                      newFormFields?.[key]?.trim()?.length > 100)
                  ) {
                    newErrors[key] = "*Must be between 2-100 characters";
                    isFormValid = false;
                  } else {
                    newErrors[key] = null;
                    newIsDirty[key] = false;
                  }
                }
                break;
              }

              case "email": {
                // if user is not logged in, validate email field
                if (!isLoggedIn) {
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
                }
                break;
              }

              case "phone": {
                // if user is not logged in, validate phone field
                if (!isLoggedIn) {
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
                }
                break;
              }

              case "dob": {
                // if user is not logged in, validate dob field
                if (!isLoggedIn) {
                  if (!newFormFields?.[key]?.trim()?.length) {
                    newErrors[key] = "*Date of birth is required";
                    isFormValid = false;
                  } else {
                    newErrors[key] = null;
                    newIsDirty[key] = false;
                  }
                }
                break;
              }

              // billing address form validation
              case "streetAddress":
              case "addressLine2":
              case "city":
              case "state":
              case "zipCode":
              case "country": {
                if (
                  key !== "addressLine2" &&
                  !newFormFields?.[key]?.trim()?.length
                ) {
                  newErrors[key] = `*Required`;
                  isFormValid = false;
                } else if (
                  // check if the address fields have special characters / numbers
                  key !== "zipCode" &&
                  /[^a-zA-Z0-9\s'-]/?.test(newFormFields?.[key] || "")
                ) {
                  newErrors[key] = "*Special characters are not allowed";
                  isFormValid = false;
                } else if (
                  (key === "streetAddress" ||
                    (key === "addressLine2" &&
                      newFormFields?.[key]?.trim()?.length)) &&
                  (newFormFields?.[key]?.trim()?.length < 2 ||
                    newFormFields?.[key]?.trim()?.length > 100)
                ) {
                  newErrors[key] = "*Must be between 2-100 characters";
                  isFormValid = false;
                } else if (
                  (key === "city" &&
                    newFormFields?.[key]?.trim()?.length < 2) ||
                  newFormFields?.[key]?.trim()?.length > 50
                ) {
                  newErrors[key] = "*Must be between 2-50 characters";
                  isFormValid = false;
                } else if (
                  key === "zipCode" &&
                  !REGEX_CONFIG?.USZipCode?.test(newFormFields?.[key])
                ) {
                  newErrors[key] = "*Invalid zip code";
                  isFormValid = false;
                } else {
                  newErrors[key] = null;
                  newIsDirty[key] = false;
                }
                break;
              }

              // payment info form validation
              // case "cardNumber":
              // case "expiryDate":
              // case "cvv":
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
                // if user is not logged in, validate password field
                if (!isLoggedIn) {
                  if (!newFormFields?.[key]?.trim()?.length) {
                    newErrors[key] = `*Required`;
                    isFormValid = false;
                  } else if (!isValidPassword(newFormFields?.[key])) {
                    newErrors[key] =
                      "*Password must be 8–20 characters with a letter, number, and special character.";
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
        // reject(new Error("Form is not valid"));
        // return;
        resolve({
          error: true,
          payload: {},
        });
        return;
      }

      if (!formFields?.acceptTerms) {
        showErrorToast("Please accept the terms and conditions");
        resolve({
          error: true,
          payload: {},
        });
        return;
      }

      const payload = {
        // basic info
        firstName: newFormFields?.firstName || undefined,
        lastName: newFormFields?.lastName || undefined,
        email: newFormFields?.email || undefined,
        phone: newFormFields?.phone || undefined,
        dob: newFormFields?.dob
          ? formatDate(newFormFields?.dob, "YYYY-MM-DD")
          : undefined,

        // billing address
        billingAddress: {
          street: newFormFields?.streetAddress || undefined,
          addressLine2: newFormFields?.addressLine2 || undefined,
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
          // NMI Payment Information
          paymentMethod: newFormFields?.paymentMethod || "",
          paymentToken: newFormFields?.paymentToken || "",
          cardLast4: newFormFields?.cardLast4 || "",
          cardType: newFormFields?.cardType || "",
          cardBrand: newFormFields?.cardType || "", // cardType and cardBrand are the same from NMI
        },

        // questionnaire responses
        questionnaireResponses: [], // will be populated on useOrderCheckout hook at the time of checkout
      };

      if (isLoggedIn) {
        // delete basic info fields
        delete payload["firstName"];
        delete payload["lastName"];
        delete payload["email"];
        delete payload["phone"];
        delete payload["dob"];

        // delete password field
        delete payload["password"];
      }

      console.log("payload", payload);
      resolve({
        error: false,
        payload: payload || {},
      });
    });
  };

  return {
    isLoggedIn,
    formFields,
    errors,
    handleOnChange: _handleOnChange,
    handleGetPayload: _handleGetPayload,
    setErrors,
  };
};

export default useCheckoutDetails;
