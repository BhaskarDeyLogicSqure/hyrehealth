import ConsultationRenewalComponent from "./ConsultationRenewalComponent";
import { postCheckoutApi } from "@/api/postCheckout/postCheckoutApi";

const RenewalPage = async ({ subscriptionId }: { subscriptionId: string }) => {
  console.log({ subscriptionId });
  // const { data: renewalDetails } = await postCheckoutApi.getRenewalDetails(
  //   subscriptionId
  // );

  // console.log({ renewalDetails });

  const currentPlan = {
    id: "1",
    title: "1-Month Plan",
    price: 100,
    duration: 1, // months
    product: "Semaglutide",
    dosage: "0.5mg",
    lastConsultation: "2024-12-01",
    isConsultationValid: true,
  };

  // const needsNewConsultation = currentPlan?.duration >= 3;

  // if (needsNewConsultation) {
  //   return <NeedNewConsultation />;
  // }

  return <ConsultationRenewalComponent currentPlan={currentPlan} />;
};

export default RenewalPage;
