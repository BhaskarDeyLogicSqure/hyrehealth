import { postCheckoutApi } from "@/api/postCheckout/postCheckoutApi";
import { showErrorToast } from "@/components/GlobalErrorHandler";
import { useRef, useState, useEffect } from "react";

declare global {
  interface Window {
    CollectJS?: {
      configure: (config: any) => void;
      startPaymentRequest: (callback: (response: any) => void) => void;
      clearInputs: () => void;
    };
  }
}

const useNMIPayments = (setErrors: (error: any) => void) => {
  const [isCollectJSLoaded, setIsCollectJSLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentToken, setPaymentToken] = useState<string | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const tokenPromiseRef = useRef<{
    resolve: (token: string) => void;
    reject: (error: string) => void;
  } | null>(null);
  const [fieldValidation, setFieldValidation] = useState({
    ccnumber: false,
    ccexp: false,
    cvv: false,
  });
  const [shouldShowErrors, setShouldShowErrors] = useState(false);

  // NMI Configuration
  const NMI_CONFIG = {
    // tokenizationKey: process.env.NEXT_PUBLIC_NMI_TOKENIZATION_KEY || "",
    variant: "inline",
    invalidCss: {
      color: "#dc2626",
      border: "1px solid #dc2626",
      "border-color": "#dc2626",
    },
    validCss: {
      color: "#059669",
      "border-color": "#059669",
    },
    focusCss: {
      "border-color": "#3b82f6",
      "box-shadow": "0 0 0 3px rgba(59, 130, 246, 0.1)",
    },
    customCss: {
      "background-color": "#fff",
      border: "1.5px solid #e5e7eb",
      "border-radius": "8px",
      padding: "12px 16px",
      height: "40px",
      width: "100%",
      "box-sizing": "border-box",
      "font-size": "16px",
      "font-family": "inherit",
      "line-height": "1.5",
      color: "#111827",
      outline: "none",
      transition: "border-color 0.2s, box-shadow 0.2s",
      "box-shadow": "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
      display: "flex",
      "align-items": "center",
      overflow: "visible",
    },
    placeholderCss: {
      color: "hsl(var(--muted-foreground))",
    },
  };

  const _getMerchantNMIpaymentToken = async (): Promise<string | null> => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await postCheckoutApi.getMerchantNMITokenizationKey();
        if (response?.data?.nmiMerchantApiKey) {
          const token = response?.data?.nmiMerchantApiKey;
          resolve(token);
        }
      } catch (error) {
        console.error("Merchant NMI payment token API error:", error);
        showErrorToast(
          (error as any)?.message ||
            "Failed to get merchant NMI payment token, please try again later"
        );
        resolve(null);
      }
    });
  };

  const _initializeCollectJs = async () => {
    const tokenizationKey = await _getMerchantNMIpaymentToken();
    console.log({ tokenizationKey });

    _loadCollectJS(tokenizationKey as string);
  };

  useEffect(() => {
    _initializeCollectJs();

    // Add CSS for Collect.js iframes to ensure proper sizing
    const style = document.createElement("style");
    style.textContent = `
       /* Ensure Collect.js iframes take full width and height */
       div[data-collect-js] iframe {
         width: 100% !important;
         height: 40px !important;
         border: none !important;
         display: block !important;
       }
       
       /* Remove any default margins/padding */
       div[data-collect-js] {
         width: 100% !important;
         min-height: 40px !important;
         display: block !important;
       }
     `;
    document.head.appendChild(style);

    return () => {
      _cleanup();
      // Clean up the style element
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const _loadCollectJS = (tokenizationKey: string) => {
    if (window.CollectJS) {
      setIsCollectJSLoaded(true);
      _initializeCollectJS();
      return;
    }

    if (!tokenizationKey) {
      setPaymentError(
        "Failed to load payment security layer. Please refresh and try again."
      );
      return;
    }

    if (scriptRef.current) return;

    const script = document.createElement("script");
    script.src = "https://secure.nmi.com/token/Collect.js";
    script.async = true;

    script.setAttribute("data-tokenization-key", tokenizationKey);
    script.setAttribute("data-variant", NMI_CONFIG?.variant);

    script.onload = () => {
      setIsCollectJSLoaded(true);
      _initializeCollectJS();
    };

    script.onerror = () => {
      setPaymentError(
        "Failed to load payment security layer. Please refresh and try again."
      );
    };

    document.head.appendChild(script);
    scriptRef.current = script;
  };

  const _initializeCollectJS = () => {
    if (!window.CollectJS) return;

    try {
      window.CollectJS.configure({
        ...NMI_CONFIG,
        callback: _handleCollectJSResponse,
        fieldsAvailableCallback: () => {
          console.log("Collect.js fields ready");
          setIsCollectJSLoaded(true);
        },
        validationCallback: (
          field: string,
          status: boolean,
          message: string
        ) => {
          console.log(`Field ${field} validation:`, { status, message });

          // Update field validation state
          setFieldValidation((prev) => ({
            ...prev,
            [field]: status,
          }));

          // Only set errors if shouldShowErrors is true (after submit attempt)
          if (shouldShowErrors) {
            setErrors((prev: any) => ({
              ...prev,
              [field]: !status ? message : "",
            }));
          }

          // Handle validation feedback in form errors
          //   if (!status && message) {
          //     handleOnChange(`${field}Error`, message);
          //   } else {
          //     handleOnChange(`${field}Error`, "");
          //   }
        },
      });
    } catch (error) {
      console.error("Failed to configure CollectJS:", error);
      setPaymentError("Payment system configuration error.");
    }
  };

  const _handleCollectJSResponse = (response: any) => {
    setIsProcessing(false);

    if (response?.token) {
      // Successfully generated token
      const token = response?.token;
      setPaymentToken(token);

      // Resolve the promise with the token
      if (tokenPromiseRef.current) {
        tokenPromiseRef.current.resolve(token);
        tokenPromiseRef.current = null;
      }

      return {
        token,
      };
    } else {
      // Error occurred
      const errorMessage =
        response.error ||
        "Payment tokenization failed. Please check your card details.";
      setPaymentError(errorMessage);
      _clearPaymentData();

      // Reject the promise with the error
      if (tokenPromiseRef.current) {
        tokenPromiseRef.current.reject(errorMessage);
        tokenPromiseRef.current = null;
      }
    }
  };

  const _generateToken = (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!window.CollectJS) {
        const error = "Payment system not loaded. Please refresh the page.";
        setPaymentError(error);
        resolve(null);
        return;
      }

      // Enable error display when submit is attempted
      setShouldShowErrors(true);

      // For Collect.js fields, we check field validation state
      // For cardholder name, we check formFields since it's a regular input
      const isCollectJSFieldsValid =
        fieldValidation.ccnumber &&
        fieldValidation.ccexp &&
        fieldValidation.cvv;
      // const isCardholderNameValid = formFields?.cardholderName?.trim();

      if (!isCollectJSFieldsValid) {
        const error = "Please fill in all payment card fields correctly.";
        setPaymentError(error);

        // Show validation errors for invalid fields
        setErrors((prev: any) => ({
          ...prev,
          ccnumber: !fieldValidation?.ccnumber
            ? "*Card number is required"
            : "",
          ccexp: !fieldValidation?.ccexp ? "*Expiry date is required" : "",
          cvv: !fieldValidation?.cvv ? "*CVV is required" : "",
        }));

        resolve(null);
        return;
      }

      setIsProcessing(true);
      setPaymentError(null);

      // Store the promise resolver (only resolve, no reject)
      tokenPromiseRef.current = {
        resolve,
        reject: (error: string) => {
          console.error("Payment token generation failed:", error);
          resolve(null);
        },
      };

      try {
        window.CollectJS.startPaymentRequest(_handleCollectJSResponse);
      } catch (error) {
        console.error("Error generating token:", error);
        const errorMessage =
          "Failed to generate payment token. Please try again.";
        setPaymentError(errorMessage);
        setIsProcessing(false);
        tokenPromiseRef.current = null;
        resolve(null);
      }
    });
  };

  const _clearPaymentData = () => {
    setPaymentToken(null);
  };

  const _cleanup = () => {
    if (scriptRef.current && document.head.contains(scriptRef.current)) {
      document.head.removeChild(scriptRef.current);
    }
  };

  useEffect(() => {
    // Only show errors if shouldShowErrors is true and after submit attempt
    if (shouldShowErrors) {
      setErrors((prev: any) => ({
        ...prev,
        ccnumber: !fieldValidation?.ccnumber ? "*Card number is required" : "",
        ccexp: !fieldValidation?.ccexp ? "*Expiry date is required" : "",
        cvv: !fieldValidation?.cvv ? "*CVV is required" : "",
      }));
    }
  }, [fieldValidation, shouldShowErrors]);

  return {
    isCollectJSLoaded,
    isProcessing,
    paymentError,
    paymentToken,
    fieldValidation,
    generateToken: _generateToken,
  };
};

export default useNMIPayments;
