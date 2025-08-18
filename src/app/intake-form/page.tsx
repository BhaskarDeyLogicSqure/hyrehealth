"use client";

import dynamic from "next/dynamic";
import ThemeLoader from "@/components/ThemeLoader";
import { showErrorToast } from "@/components/GlobalErrorHandler";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Dynamic import for the intake form component
const IntakeForm = dynamic(() => import("@/components/IntakeForm/index"), {
  loading: () => (
    <ThemeLoader variant="full-page" message="Loading intake form..." />
  ),
});

const IntakeFormPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";

  useEffect(() => {
    if (!orderId) {
      showErrorToast("No Order ID found");
      router.push("/");
    }
  }, [orderId]);

  return <IntakeForm orderId={orderId} />;
};

export default IntakeFormPage;
