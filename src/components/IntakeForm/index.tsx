"use client";

import { Suspense } from "react";
import ThemeLoader from "@/components/ThemeLoader";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { showErrorToast } from "@/components/GlobalErrorHandler";
import IntakeFormComponent from "./IntakeFormComponent";

interface IntakeFormProps {
  searchParams?: {
    orderId?: string;
  };
}

const IntakeForm = ({ searchParams = {} }: IntakeFormProps) => {
  const router = useRouter();
  const orderId = searchParams?.orderId || "";

  useEffect(() => {
    if (!orderId) {
      showErrorToast("Order ID is required");
      router.push("/");
    }
  }, [orderId, router]);

  if (!orderId) {
    return (
      <div className="theme-bg min-h-screen">
        <ThemeLoader variant="full-page" message="Loading..." />
      </div>
    );
  }

  return (
    <div className="theme-bg min-h-screen">
      <Suspense
        fallback={
          <ThemeLoader variant="full-page" message="Loading intake form..." />
        }
      >
        <IntakeFormComponent orderId={orderId} />
      </Suspense>
    </div>
  );
};

export default IntakeForm;
