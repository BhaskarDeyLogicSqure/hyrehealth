"use client";

import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { MerchantLegalDocument } from "@/types/auth";
import { AlertCircle, FileText, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { formatAddress } from "@/lib/utils";
import { Address } from "@/types";

interface LegalDocumentViewerProps {
  documentType: "termsAndConditions" | "privacyPolicy" | "hipaaCompliance";
  fallbackTitle: string;
}

const LegalDocumentViewer: React.FC<LegalDocumentViewerProps> = ({
  documentType,
  fallbackTitle,
}) => {
  const { merchantData } = useSelector(
    (state: RootState) => state?.merchantReducer
  );

  // Find the specific document based on documentType
  const document: MerchantLegalDocument | undefined =
    merchantData?.merchantOwnLegalDocuments?.find(
      (doc) => doc?.documentType === documentType
    );

  // If no document found, show fallback content or default message
  if (!document) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl min-h-[80vh]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-start gap-3">
            {/* <FileText className="h-8 w-8" /> */}
            {fallbackTitle}
          </h1>
        </div>
        <Alert className="max-w-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This document is currently not available. Please contact support for
            more information.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const _updatedDocumentText = useMemo(() => {
    if (document?.documentDetailsHtmlText) {
      let updatedText = document?.documentDetailsHtmlText;
      updatedText = updatedText
        ?.replace(/{{name}}/g, merchantData?.merchantName || "")
        ?.replace(
          /{{address}}/g,
          formatAddress(
            merchantData?.merchantAddress ||
              merchantData?.address ||
              ({} as Address)
          )
        )
        ?.replace(/{{websiteName}}/g, merchantData?.merchantWebsiteName || "")
        ?.replace(/{{email}}/g, merchantData?.merchantEmail || "")
        ?.replace(/{{supportEmail}}/g, merchantData?.supportEmail || "");
      return updatedText;
    }
  }, [document?.documentDetailsHtmlText, merchantData]);

  // Check if document has HTML content
  if (_updatedDocumentText) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl min-h-[80vh]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {documentType === "hipaaCompliance"
              ? "Return / Refund Policy"
              : document?.documentName || fallbackTitle}
          </h1>
          {/* <p className="text-muted-foreground">Legal Document</p> */}
        </div>
        <div
          className="legal-document-content max-w-none"
          dangerouslySetInnerHTML={{
            __html: _updatedDocumentText || "",
          }}
        />
      </div>
    );
  }

  // Check if document has PDF URL
  if (document?.documentUrl) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-6">
          {/* <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
            <FileText className="h-8 w-8" />
            {document?.documentName || fallbackTitle}
          </h1> */}
          <div className="flex items-center justify-end gap-4">
            {/* <p className="text-muted-foreground">PDF Document</p> */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(document?.documentUrl, "_blank")}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open in New Tab
            </Button>
          </div>
        </div>

        <div className="w-full">
          <div className="w-full h-[800px] border border-border rounded-lg overflow-hidden bg-background shadow-sm">
            <iframe
              src={document?.documentUrl}
              className="w-full h-full border-0"
              title={document?.documentName || fallbackTitle}
            />
          </div>
        </div>
      </div>
    );
  }

  // Fallback if document exists but has no content
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <FileText className="h-8 w-8" />
          {documentType === "hipaaCompliance"
            ? "Return / Refund Policy"
            : document?.documentName || fallbackTitle}
        </h1>
      </div>
      <Alert className="max-w-2xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This document content is not available. Please contact support for
          assistance.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default LegalDocumentViewer;
