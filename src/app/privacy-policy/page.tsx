import React from "react";
import LegalDocumentViewer from "@/components/legal/LegalDocumentViewer";

const PrivacyPolicyPage = () => {
  return (
    <LegalDocumentViewer
      documentType="privacyPolicy"
      fallbackTitle="Privacy Policy"
    />
  );
};

export default PrivacyPolicyPage;
