import React from "react";
import LegalDocumentViewer from "@/components/legal/LegalDocumentViewer";

const TermsAndConditionsPage = () => {
  return (
    <LegalDocumentViewer
      documentType="termsAndConditions"
      fallbackTitle="Terms and Conditions"
    />
  );
};

export default TermsAndConditionsPage;
