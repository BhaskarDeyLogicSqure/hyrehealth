"use client";

import useMeetingDetails from "@/api/postCheckout/useMeetingDetails";
import ThemeLoader from "@/components/ThemeLoader";
import { extractQueryParams } from "@/lib/utils";
import React from "react";

const MeetingRoom = () => {
  const { orderId } = extractQueryParams();

  const {
    meetingDetails,
    isMeetingDetailsError,
    meetingDetailsError,
    isMeetingLinkLoading,
  } = useMeetingDetails(orderId);

  const meetingLink = meetingDetails?.meetingLink;

  return (
    <div className="innerPgWrap">
      <div className="h-[90vh]">
        {isMeetingLinkLoading ? (
          <div className="flex h-full items-center justify-center">
            <ThemeLoader
              variant="simple"
              message="Preparing your consultation room..."
            />
          </div>
        ) : isMeetingDetailsError || !meetingLink ? (
          <div className="flex h-full items-center justify-center text-center text-gray-600">
            {meetingDetailsError?.message ||
              "We couldn't load your consultation room. Please try again."}
          </div>
        ) : (
          <iframe
            allow="autoplay; camera; microphone"
            src={meetingLink}
            width="100%"
            height="100%"
          />
        )}
      </div>
    </div>
  );
};

export default MeetingRoom;
