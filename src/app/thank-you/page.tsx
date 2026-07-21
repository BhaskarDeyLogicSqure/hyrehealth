"use client";

import { useEffect, useTransition } from "react";
// DocuSign disabled — useRef/useState were only used by disclaimer signing.
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  // FileSignature, // DocuSign disabled — used only by removed Sign Disclaimer button.
  Video,
  Clock,
  Truck,
  Mail,
  Box,
} from "lucide-react";
import { SUPPORT_EMAIL } from "@/configs";
import useAllowPatientSelectDosage from "@/hooks/useAllowPatientSelectDosage";
import { useOrderConfirmation } from "@/api/postCheckout/useOrderConfirmation";
import {
  showErrorToast,
  // showInfoToast, // DocuSign disabled — used only by removed verify effect.
  showSuccessToast,
} from "@/components/GlobalErrorHandler";
import ThemeLoader from "@/components/ThemeLoader";
import useMeetingDetails from "@/api/postCheckout/useMeetingDetails";
import { useDisclaimerStatus } from "@/api/postCheckout/useDisclaimerStatus";
import { postCheckoutApi } from "@/api/postCheckout/postCheckoutApi";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const ThankYouPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  // DocuSign disabled — token/event were the DocuSign signing-return params.
  // const token = searchParams.get("token");
  // const event = searchParams.get("event");

  const { merchantData } = useSelector(
    (state: RootState) => state?.merchantReducer,
  );

  // In the Current flow (allowPatientSelectDosage = false) only the flat
  // consultation fee is charged up front; medication is prescribed + billed later,
  // so we hide product/medication prices.
  const isCurrentFlow = !useAllowPatientSelectDosage();

  const [isLoading, setTransition] = useTransition();
  // DocuSign disabled — disclaimer generating/verify state no longer needed.
  // const [isDisclaimerGenerating, setIsDisclaimerGenerating] = useState(false);
  // const disclaimerVerifyAttempted = useRef(false);

  // Post-checkout data is fetched in a strict sequence:
  // 1) invoice / order confirmation
  // 2) disclaimer status — triggers the meeting invite when already signed
  // 3) meeting link — only once disclaimer status resolves AND is signed
  const {
    orderConfirmation,
    isOrderConfirmationLoading,
    isOrderConfirmationError,
    orderConfirmationError,
    isOrderConfirmationFetched,
  } = useOrderConfirmation(orderId);

  // DocuSign disabled — the signed/loading/refetch values are no longer consumed,
  // but the call is kept because disclaimer-status is what triggers the meeting
  // invite on the backend. Do not destructure (nothing here is used any more).
  useDisclaimerStatus(orderId, { enabled: isOrderConfirmationFetched });

  // DocuSign disabled — no signing step in current flow, so the consultation is
  // available as soon as the order is confirmed. Fetch the meeting link once the
  // order confirmation resolves (it may come back empty briefly; hook retries 2s).
  const {
    meetingDetails,
    isMeetingDetailsError,
    meetingDetailsError,
    hasMeetingLink,
    isMeetingLinkLoading,
  } = useMeetingDetails(orderId || "", { enabled: isOrderConfirmationFetched });

  const orderStatus = "Awaiting Consultation"; // Default status since it's not in the API response
  const products = orderConfirmation?.products || [];

  // DocuSign disabled — disclaimer signing not required in current flow.
  // const _handleSignDisclaimer = async () => {
  //   try {
  //     setIsDisclaimerGenerating(true);
  //     const response = await postCheckoutApi.generateDisclaimer(orderId!);
  //     const signingUrl = response?.data?.signingUrl;
  //     if (!signingUrl) {
  //       showErrorToast("Could not get signing URL. Please try again.");
  //       return;
  //     }
  //     window.location.href = signingUrl;
  //   } catch (e) {
  //     showErrorToast(
  //       (e as any)?.message || "Failed to initiate disclaimer signing.",
  //     );
  //   } finally {
  //     setIsDisclaimerGenerating(false);
  //   }
  // };

  const _handleJoinConsultation = async () => {
    try {
      // setIsLoading(true);
      showSuccessToast("Connecting to Provider...");

      // simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (isMeetingDetailsError) {
        showErrorToast(meetingDetailsError?.message || "Connection Error");
        return;
      }

      if (!meetingDetails?.meetingLink) {
        showErrorToast(
          "Your consultation room isn't ready yet. Please wait a moment and try again.",
        );
        return;
      }

      showSuccessToast("Consultation Ready");
      router.push(`/meeting-room?orderId=${orderId}`);
    } catch (error) {
      console.error("Error joining consultation:", error);
      showErrorToast("Connection Error");
    } finally {
      // setIsLoading(false);
    }
  };

  // DocuSign disabled — verify-on-return (token/event) not needed in current flow.
  // useEffect(() => {
  //   if (!token || !event || !orderId || disclaimerVerifyAttempted.current)
  //     return;
  //   disclaimerVerifyAttempted.current = true;
  //
  //   const verify = async () => {
  //     try {
  //       const response = await postCheckoutApi.verifyDisclaimer({
  //         token,
  //         event,
  //       });
  //       if (response?.data?.verified) {
  //         showSuccessToast("Disclaimer signed successfully!");
  //       } else {
  //         showInfoToast("Disclaimer signing was not completed.");
  //       }
  //     } catch (e: any) {
  //       showErrorToast(e?.message || "Disclaimer verification failed.");
  //     } finally {
  //       // strip token + event from URL, keep orderId
  //       router.replace(`/thank-you?orderId=${orderId}`);
  //       refetchDisclaimer();
  //     }
  //   };
  //
  //   verify();
  // }, [token, event, orderId]);

  useEffect(() => {
    // Show error toast if there's an error
    if (isOrderConfirmationError) {
      const errorMessage =
        orderConfirmationError?.message || "Failed to load order details";
      showErrorToast(errorMessage);

      // redirect to home page
      // router.push("/");
    }

    // redirect to home page if no orderId
    if (!orderId) {
      showErrorToast("No order ID found");
      router.push("/");
    }
  }, [orderId, isOrderConfirmationError, orderConfirmationError]);

  // While the consultation room is being provisioned, keep a persistent info
  // toast up so the user knows why "Start Consultation" is disabled.
  useEffect(() => {
    const TOAST_ID = "meeting-link-preparing";
    if (isMeetingLinkLoading) {
      toast("Preparing your consultation room. This may take a few seconds…", {
        id: TOAST_ID,
        duration: Infinity,
        icon: "⏳",
        style: {
          background: "#3b82f6",
          color: "#fff",
          fontSize: "16px",
          padding: "16px",
          borderRadius: "10px",
        },
      });
    } else {
      toast.dismiss(TOAST_ID);
    }
    return () => toast.dismiss(TOAST_ID);
  }, [isMeetingLinkLoading]);

  // If polling is exhausted and we still have no link, tell the user how to recover.
  useEffect(() => {
    if (isMeetingDetailsError) {
      showErrorToast(
        "Your consultation room is taking longer than expected. Please refresh the page or contact support.",
      );
    }
  }, [isMeetingDetailsError]);

  // Show loading state
  if (isOrderConfirmationLoading) {
    return <ThemeLoader type="general" variant="full-page" />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Order Confirmation Banner */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600">
            Your treatment plan is ready to begin
          </p>
        </div>

        {/* Order Details Section */}
        <Card className="mb-8 shadow-sm border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Box className="h-5 w-5 text-blue-600" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Products List */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Products in Your Order
              </h3>
              <div className="space-y-4">
                {products?.map((product: any, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row md:items-center md:justify-between rounded-lg border border-muted px-4 py-3 bg-muted/50"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-gray-900">
                        {product?.name}
                      </span>
                      {product?.description ? (
                        <span className="text-sm text-gray-600">
                          Description: {product?.description}
                        </span>
                      ) : null}
                      {/* {product?.dosage && (
                        <span className="text-sm text-gray-600">
                          Dosage: {product?.dosage}
                        </span>
                      )} */}
                    </div>
                    {!isCurrentFlow && product?.totalPrice ? (
                      <div className="mt-2 md:mt-0 text-right">
                        <span className="font-semibold text-gray-900">
                          ${product?.totalPrice} / month
                        </span>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-bold text-gray-900">
                  #{orderConfirmation?.invoiceNumber}
                </span>
              </div>
              {isCurrentFlow ? (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Consultation Fee:</span>
                  <span className="font-bold text-gray-900">
                    ${orderConfirmation?.pricing?.total}
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-gray-900">
                  ${orderConfirmation?.pricing?.total}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className="font-bold text-green-600">{orderStatus}</span>
              </div>

              {isCurrentFlow ? (
                <p className="text-xs text-red-600 leading-relaxed">
                  This charge is for your medical consultation only. Your
                  medication is billed separately after the consultation, based
                  on the dosage your provider prescribes.
                </p>
              ) : null}
            </div>

            {/* Action Button */}
            {/* DocuSign disabled — no signing gate; the Start Consultation button
                is always shown (was previously behind `isDisclaimerSigned`). */}
            <div className="pt-6 text-center">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                onClick={() => setTransition(() => _handleJoinConsultation())}
                style={{
                  backgroundColor: merchantData?.customizeBranding?.accentColor,
                }}
                disabled={isLoading || !hasMeetingLink}
              >
                <Video className="h-5 w-5 mr-2" />
                {isMeetingLinkLoading
                  ? "Preparing Consultation..."
                  : `Start Consultation${isLoading ? "..." : ""}`}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* What Happens Next Section */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">What Happens Next</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Video className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Join your consultation call with a licensed provider
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Use the button above to connect immediately
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  The doctor will confirm your eligibility and prescribe the
                  best dosage
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Your consultation typically takes 10-15 minutes
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Your physician-approved wellness program will be processed and
                  shipped within 1-3 business days
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Discreet packaging with tracking information provided
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  You'll receive updates via email and can manage everything
                  from "My Account"
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Track your order, schedule follow-ups, and manage
                  subscriptions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Support */}
        <div className="text-center mt-12 pt-8">
          <p className="text-gray-600">
            Need help? Contact our support team at{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              {SUPPORT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
