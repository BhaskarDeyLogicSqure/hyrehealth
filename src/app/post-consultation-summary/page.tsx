"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PostConsultationSummaryComponent from "@/components/PostConsultationSummary/PostConsultationSummaryComponent";
import { showErrorToast } from "@/components/GlobalErrorHandler";

interface PostConsultationSummaryProps {
  searchParams: { consultationId: string };
}

const PostConsultationSummary = ({
  searchParams,
}: PostConsultationSummaryProps) => {
  const { consultationId } = searchParams;
  const router = useRouter();

  useEffect(() => {
    if (!consultationId) {
      showErrorToast("No consultation ID provided. Redirecting back...");
      // Redirect to previous page after a short delay
      setTimeout(() => {
        router.back();
      }, 2000);
    }
  }, [consultationId, router]);

  if (!consultationId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Missing Consultation ID
          </h1>
          <p className="text-gray-600">Redirecting back to previous page...</p>
        </div>
      </div>
    );
  }

  return <PostConsultationSummaryComponent consultationId={consultationId} />;
};

export default PostConsultationSummary;
