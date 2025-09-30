import React from "react";
import LegalDocumentViewer from "@/components/legal/LegalDocumentViewer";

const ReturnPolicyPage = () => {
  return (
    <LegalDocumentViewer
      documentType="hipaaCompliance"
      fallbackTitle="Return / Refund Policy"
    />
  );
};

export default ReturnPolicyPage;
