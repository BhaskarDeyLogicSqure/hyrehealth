import dynamic from "next/dynamic";
import ThemeLoader from "@/components/ThemeLoader";

// Dynamic import for the intake form component
const IntakeForm = dynamic(() => import("@/components/IntakeForm/index"), {
  loading: () => (
    <ThemeLoader variant="full-page" message="Loading intake form..." />
  ),
});

const IntakeFormPage = () => {
  return <IntakeForm />;
};

export default IntakeFormPage;
