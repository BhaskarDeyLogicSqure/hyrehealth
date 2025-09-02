import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

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
  const { merchantData } = useSelector(
    (state: RootState) => state?.merchantReducer
  );

  const [isCollectJSLoaded, setIsCollectJSLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentToken, setPaymentToken] = useState<string | null>(null);
  const [initializationAttempts, setInitializationAttempts] = useState(0);
  const [isInitializing, setIsInitializing] = useState(false);

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

  const _initializeCollectJs = async () => {
    if (isInitializing) return; // Prevent multiple simultaneous initializations

    try {
      setIsInitializing(true);
      setInitializationAttempts((prev) => prev + 1);

      console.log("Merchant data:", merchantData);
      const tokenizationKey = merchantData?.nmiMerchantApiKey;
      console.log("Tokenization key:", tokenizationKey);

      if (!merchantData) {
        throw new Error("Merchant data not loaded yet");
      }

      if (!tokenizationKey) {
        throw new Error("NMI tokenization key not found in merchant data");
      }

      _loadCollectJS(tokenizationKey as string);
    } catch (error) {
      console.error("Failed to initialize CollectJS:", error);

      if (!merchantData) {
        setPaymentError("Loading payment system...");
      } else {
        setPaymentError(
          "Failed to initialize payment system. Please refresh and try again."
        );
      }

      // Retry up to 3 times only if we have merchant data
      if (merchantData && initializationAttempts < 3) {
        setTimeout(() => {
          setIsInitializing(false);
          _initializeCollectJs();
        }, 2000);
      }
    } finally {
      setIsInitializing(false);
    }
  };

  // Effect to initialize when merchant data becomes available
  useEffect(() => {
    if (
      merchantData?.nmiMerchantApiKey &&
      !isCollectJSLoaded &&
      !isInitializing
    ) {
      console.log("Merchant data available, initializing CollectJS...");
      _initializeCollectJs();
    }
  }, [merchantData, isCollectJSLoaded, isInitializing]);

  useEffect(() => {
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
      console.log("CollectJS already available");
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

    if (scriptRef.current) {
      console.log("CollectJS script already loading/loaded");
      return;
    }

    console.log(
      "Loading CollectJS script with tokenization key:",
      tokenizationKey
    );

    const script = document.createElement("script");
    script.src = "https://secure.nmi.com/token/Collect.js";
    script.async = true;

    script.setAttribute("data-tokenization-key", tokenizationKey);
    script.setAttribute("data-variant", NMI_CONFIG?.variant);

    script.onload = () => {
      console.log("CollectJS script loaded successfully");
      // Add a delay to ensure the script is fully initialized
      setTimeout(() => {
        if (window.CollectJS) {
          _initializeCollectJS();
        } else {
          console.error("CollectJS not available after script load");
          setPaymentError(
            "Payment system failed to initialize. Please refresh and try again."
          );
        }
      }, 500); // Increased delay to 500ms
    };

    script.onerror = (error) => {
      console.error("Failed to load CollectJS script:", error);
      setPaymentError(
        "Failed to load payment security layer. Please check your internet connection and try again."
      );

      // Clean up failed script
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current);
        scriptRef.current = null;
      }

      // Retry after 3 seconds
      setTimeout(() => {
        if (initializationAttempts < 3) {
          _loadCollectJS(tokenizationKey);
        }
      }, 3000);
    };

    document.head.appendChild(script);
    scriptRef.current = script;
  };

  const _initializeCollectJS = () => {
    if (!window.CollectJS) {
      console.error("CollectJS not available for initialization");
      return;
    }

    try {
      console.log("Configuring CollectJS...");
      window.CollectJS.configure({
        ...NMI_CONFIG,
        callback: _handleCollectJSResponse,
        fieldsAvailableCallback: () => {
          console.log("Collect.js fields ready and available");
          setIsCollectJSLoaded(true);
          setPaymentError(null); // Clear any previous errors
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
        },
      });
    } catch (error) {
      console.error("Failed to configure CollectJS:", error);
      setPaymentError(
        "Payment system configuration error. Please refresh the page."
      );
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
    isInitializing, // Add this for loading states
    merchantDataAvailable: !!merchantData?.nmiMerchantApiKey, // Add this to check if merchant data is available
  };
};

export default useNMIPayments;
