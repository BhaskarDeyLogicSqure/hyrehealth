import SupportMethodsCard from "@/components/Support/SupportMethodsCard";
import SupportTabs from "@/components/Support/SupportTabs";

const SupportPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our support team is here to assist you every step of the way. Find
            answers to common questions or get in touch directly.
          </p>
        </div>

        {/* Contact Methods */}
        <SupportMethodsCard />

        {/* Support Tabs - FAQ & Contact Us Form */}
        <SupportTabs />
      </div>
    </div>
  );
};

export default SupportPage;
