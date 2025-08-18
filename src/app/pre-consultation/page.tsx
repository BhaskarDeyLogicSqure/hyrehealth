"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Video, Clock, FileText } from "lucide-react";
import { SUPPORT_EMAIL } from "@/configs";
import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/GlobalErrorHandler";
import useMeetingDetails from "@/api/postCheckout/useMeetingDetails";
import ThemeLoader from "@/components/ThemeLoader";

const PreConsultation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";

  const { meetingDetails, isMeetingDetailsError, meetingDetailsError } =
    useMeetingDetails(orderId);
  const [isLoading, setIsLoading] = useState(false);

  const [isTransitionLoading, setTransition] = useTransition();

  const _handleJoinConsultation = async () => {
    try {
      setIsLoading(true);
      showSuccessToast("Connecting to Provider...");

      // simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (isMeetingDetailsError) {
        showErrorToast(meetingDetailsError?.message || "Connection Error");
        return;
      }

      const meetingId = meetingDetails?.meetingUuid;

      showSuccessToast("Consultation Ready");
      router.push(`/meeting-room?meetingId=${meetingId}`);
    } catch (error) {
      console.error("Error joining consultation:", error);
      showErrorToast("Connection Error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!orderId) {
      showErrorToast("No Order ID found");
      router.push("/");
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Intake Form Complete!
          </h1>
          <p className="text-lg text-gray-600">
            You're ready for your consultation
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-semibold">#{orderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Treatment:</span>
                <span className="font-semibold capitalize">{"product"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Intake Status:</span>
                <span className="text-green-600 font-semibold">Complete</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ready for Your Consultation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Video className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Your provider will review your intake form
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    All your medical information has been securely submitted
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Consultation typically takes 10-15 minutes
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Your provider will confirm eligibility and prescribe the
                    best dosage
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <Button
                onClick={() => {
                  setTransition(() => {
                    _handleJoinConsultation();
                  });
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                size="lg"
                disabled={isLoading || isTransitionLoading}
              >
                <Video className="h-5 w-5 mr-2" />
                Join Your Consultation{" "}
                {isLoading || isTransitionLoading ? (
                  <ThemeLoader variant="simple" type="inline" />
                ) : (
                  ""
                )}
              </Button>
              <p className="text-sm text-gray-500 text-center mt-2">
                Connect with your licensed provider now
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact our support team at{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-blue-600 hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreConsultation;
