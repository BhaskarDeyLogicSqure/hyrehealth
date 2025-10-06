import { useQuery } from "@tanstack/react-query";
import { authApi } from "./authApi";
import { MerchantNMIpaymentTokenResponse } from "@/types/auth";

const useMerchantDetails = () => {
  // get merchant NMI tokenization key and other merchant details
  const {
    data: getMerchantNMITokenizationKey,
    error: getMerchantNMITokenizationKeyError,
  } = useQuery({
    queryKey: ["merchant-nmi-tokenization-key"],
    queryFn: authApi.getMerchantNMITokenizationKey,
    retry: 2,
    retryDelay: 1000,
  });

  return {
    merchantData:
      getMerchantNMITokenizationKey?.data as MerchantNMIpaymentTokenResponse["data"],
    merchantDataError: getMerchantNMITokenizationKeyError,
  };
};

export default useMerchantDetails;
