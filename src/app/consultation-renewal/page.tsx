import React from "react";
import { cookies } from "next/headers";
import dynamic from "next/dynamic";
import ThemeLoader from "@/components/ThemeLoader";

// Dynamic import for the shared renewal component
const ConsultationRenewalComponent = dynamic(
  () => import("@/components/ConsultationRenewal"),
  {
    loading: () => <ThemeLoader variant="full-page" message="Loading..." />,
  }
);

const Renewal = async ({
  searchParams,
}: {
  searchParams: { subscriptionId: string };
}) => {
  // Get current theme from cookie store
  const cookieStore = cookies();

  return (
    <ConsultationRenewalComponent
      subscriptionId={searchParams?.subscriptionId}
    />
  );
};

export default Renewal;
