"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  currentReview?: {
    rating: number;
    review: string;
  };
  onSubmit: (rating: number, review: string) => void;
}

const ReviewModal = ({
  isOpen,
  onClose,
  productName,
  currentReview,
  onSubmit,
}: ReviewModalProps) => {
  const [rating, setRating] = useState(currentReview?.rating || 0);
  const [review, setReview] = useState(currentReview?.review || "");
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleStarClick = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  const handleStarHover = (starIndex: number) => {
    setHoveredRating(starIndex + 1);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, review);
      onClose();
    }
  };

  const renderStars = (ratingValue: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= ratingValue;

      return (
        <button
          key={index}
          type="button"
          className={`${
            interactive ? "cursor-pointer" : "cursor-default"
          } transition-colors`}
          onClick={interactive ? () => handleStarClick(index) : undefined}
          onMouseEnter={interactive ? () => handleStarHover(index) : undefined}
          onMouseLeave={interactive ? handleStarLeave : undefined}
          disabled={!interactive}
        >
          <Star
            className={`h-6 w-6 ${
              isFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        </button>
      );
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Rate & Review Product
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Name */}
          <div>
            <h3 className="text-lg font-medium text-gray-900">{productName}</h3>
            <p className="text-sm text-gray-600">
              Share your experience with this product
            </p>
          </div>

          {/* Rating Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Rating</label>
            <div className="flex items-center space-x-1">
              {renderStars(hoveredRating || rating, true)}
            </div>
          </div>

          {/* Review Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Review</label>
            <Textarea
              placeholder="Share your experience with this product..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="w-full"
            >
              Submit Review
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
