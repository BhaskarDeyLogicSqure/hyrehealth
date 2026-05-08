"use client";

import React, { memo } from "react";
import { Star, StarHalf } from "lucide-react";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

type RatingDisplayProps = {
  rating?: number | null;
  reviewCount?: number | null;
  max?: number;
  showReviewCount?: boolean;
  emptyText?: string;
  className?: string;
};

const RatingDisplay = memo(function RatingDisplay({
  rating,
  reviewCount,
  max = 5,
  showReviewCount = true,
  emptyText = "No rating",
  className,
}: RatingDisplayProps) {
  const raw = Number(rating || 0);
  const safeMax = Number.isFinite(max) && max > 0 ? Math.floor(max) : 5;
  const value = clamp(Number.isFinite(raw) ? raw : 0, 0, safeMax);

  if (value <= 0) {
    return (
      <div className={className || "flex items-center"}>
        <span className="text-sm text-gray-500">{emptyText}</span>
      </div>
    );
  }

  const fullStars = Math.floor(value);
  const hasHalfStar = value - fullStars >= 0.5;
  const emptyStars = safeMax - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={className || "flex items-center"}>
      <div className="flex items-center gap-1">
        {Array.from({ length: fullStars })?.map((_, i) => (
          <Star
            key={`rating-full-${i}`}
            className="h-4 w-4 fill-yellow-400 text-yellow-400"
          />
        ))}
        {hasHalfStar ? (
          <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ) : null}
        {Array.from({ length: emptyStars })?.map((_, i) => (
          <Star key={`rating-empty-${i}`} className="h-4 w-4 text-gray-300" />
        ))}
      </div>

      {showReviewCount && (reviewCount || 0) > 0 ? (
        <span
          className="ml-2 text-sm text-gray-600"
          title={`${reviewCount} reviews`}
        >
          ({reviewCount} reviews)
        </span>
      ) : null}
    </div>
  );
});

export default RatingDisplay;

