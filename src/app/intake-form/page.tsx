import dynamic from "next/dynamic";
import ThemeLoader from "@/components/ThemeLoader";

interface PageProps {
  searchParams: {
    orderId?: string;
  };
}

// Dynamic import for the intake form component
const IntakeForm = dynamic(() => import("@/components/IntakeForm/index"), {
  loading: () => (
    <ThemeLoader variant="full-page" message="Loading intake form..." />
  ),
});

const IntakeFormPage = ({ searchParams }: PageProps) => {
  return <IntakeForm searchParams={searchParams} />;
};

export default IntakeFormPage;
