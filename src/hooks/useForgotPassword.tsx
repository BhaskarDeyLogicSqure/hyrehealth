import React, { useState } from "react";
import { useAuthApi } from "@/api/auth/useAuthApi";

const useForgotPassword = () => {
  const { forgotPassword, isForgotPasswordLoading, forgotPasswordError } =
    useAuthApi();

  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState("");

  const _validateForm = () => {
    if (!email.trim()) {
      setValidationError("Email is required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError("Please enter a valid email address");
      return false;
    }

    setValidationError("");
    return true;
  };

  const _handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!_validateForm()) {
      return;
    }

    try {
      await forgotPassword({ handle: email });

      setIsSubmitted(true);
    } catch (error) {
      console.error("Forgot password failed:", error);
    }
  };

  return {
    email,
    isLoading: isForgotPasswordLoading,
    isSubmitted,
    error: forgotPasswordError,
    validationError,
    setEmail,
    setValidationError,
    setIsSubmitted,
    handleSubmit: _handleSubmit,
    validateForm: _validateForm,
  };
};

export default useForgotPassword;
