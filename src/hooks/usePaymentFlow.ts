import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { PaymentFlowType, resolvePaymentFlow } from "@/configs";

/**
 * Resolves the merchant's payment/pricing implementation for the product +
 * checkout pages from the `/payment/merchant-nmi-key` response
 * (merchantData.paymentFlow), falling back to the env override and then the
 * default. See `resolvePaymentFlow` for the full precedence.
 */
export const usePaymentFlow = (): PaymentFlowType => {
  const { merchantData } = useSelector(
    (state: RootState) => state?.merchantReducer
  );

  return resolvePaymentFlow(merchantData?.paymentFlow);
};

export default usePaymentFlow;
