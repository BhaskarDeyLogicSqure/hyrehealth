"use client";

import { extractQueryParams } from "@/lib/utils";
import React from "react";

const MeetingRoom = () => {
  const { meetingId } = extractQueryParams();
  console.log(meetingId);

  return (
    <div className="innerPgWrap">
      <div className="h-[90vh]">
        <iframe
          allow="autoplay; camera; microphone"
          src={`https://staging.qualiphy.me/meeting/${meetingId}`}
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
};

export default MeetingRoom;
