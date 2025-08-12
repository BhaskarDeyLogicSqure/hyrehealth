import { useQuery } from "@tanstack/react-query";
import { postCheckoutApi } from "./postCheckoutApi";

const useMeetingDetails = (invoiceId: string) => {
  console.log({ invoiceId });
  const {
    data,
    isError: isMeetingDetailsError,
    error: meetingDetailsError,
  } = useQuery({
    queryKey: ["meetingDetails", invoiceId],
    queryFn: () => postCheckoutApi.getMeetingDetails(invoiceId),
  });

  console.log({ data });

  return {
    meetingDetails: data?.data,
    isMeetingDetailsError,
    meetingDetailsError,
  };
};

export default useMeetingDetails;
