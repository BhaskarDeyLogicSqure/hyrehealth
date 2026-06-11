import { useQuery } from "@tanstack/react-query";
import { postCheckoutApi } from "./postCheckoutApi";

const useMeetingDetails = (
  invoiceId: string,
  options?: { enabled?: boolean },
) => {
  const {
    data,
    isError: isMeetingDetailsError,
    error: meetingDetailsError,
  } = useQuery({
    queryKey: ["meetingDetails", invoiceId],
    queryFn: () => postCheckoutApi.getMeetingDetails(invoiceId),
    // Only fetch the meeting link once disclaimer status has resolved
    // (that call triggers the meeting invite when already signed).
    enabled: !!invoiceId && (options?.enabled ?? true),
  });

  return {
    meetingDetails: data?.data,
    isMeetingDetailsError,
    meetingDetailsError,
  };
};

export default useMeetingDetails;
