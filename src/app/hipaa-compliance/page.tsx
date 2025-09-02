import React from "react";
import LegalDocumentViewer from "@/components/legal/LegalDocumentViewer";

const HIPAACompliancePage = () => {
  return (
    <LegalDocumentViewer
      documentType="hipaaCompliance"
      fallbackTitle="HIPAA Notice of Privacy Practices"
    />
  );
};

export default HIPAACompliancePage;
