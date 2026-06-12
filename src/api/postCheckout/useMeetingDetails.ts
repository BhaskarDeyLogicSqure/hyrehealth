import { useQuery } from "@tanstack/react-query";
import { postCheckoutApi } from "./postCheckoutApi";

// The meeting link is provisioned asynchronously once the disclaimer-status
// call triggers the invite, so the first responses can come back empty
// ({ error: false, data: {} }). Poll a bounded number of times before giving up.
const MAX_MEETING_LINK_RETRIES = 5;
const MEETING_LINK_RETRY_INTERVAL = 2000; // 2s between attempts

class MeetingLinkNotReadyError extends Error {
  constructor() {
    super("Meeting link is not ready yet");
    this.name = "MeetingLinkNotReadyError";
  }
}

const useMeetingDetails = (
  invoiceId: string,
  options?: { enabled?: boolean },
) => {
  const {
    data,
    isError: isMeetingDetailsError,
    error: meetingDetailsError,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["meetingDetails", invoiceId],
    queryFn: async () => {
      const response = await postCheckoutApi.getMeetingDetails(invoiceId);
      // An empty payload means the link isn't ready yet — throw so react-query
      // retries it on the interval below.
      if (!response?.data?.meetingUuid) {
        throw new MeetingLinkNotReadyError();
      }
      return response;
    },
    enabled: !!invoiceId && (options?.enabled ?? true),
    // Retry only the "not ready yet" case, on a fixed 2s interval.
    retry: (failureCount, error) =>
      error instanceof MeetingLinkNotReadyError &&
      failureCount <= MAX_MEETING_LINK_RETRIES,
    retryDelay: MEETING_LINK_RETRY_INTERVAL,
  });

  const meetingDetails = data?.data;
  const hasMeetingLink = !!meetingDetails?.meetingUuid;

  return {
    meetingDetails,
    isMeetingDetailsError,
    meetingDetailsError,
    hasMeetingLink,
    // True while we're still polling for a not-yet-ready link.
    isMeetingLinkLoading: !hasMeetingLink && (isLoading || isFetching),
    refetchMeetingDetails: refetch,
  };
};

export default useMeetingDetails;
