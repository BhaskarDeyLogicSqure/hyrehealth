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
import { useProfileApi } from "@/api/profile/useProfileApi";

interface ReviewModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  data: any;
  onSubmit: (rating: number, review: string) => void;
}

const initialFormFields = {
  rating: 0,
  review: "",
};

const ReviewModal = ({
  isOpen,
  data,
  toggleModal,
  onSubmit,
}: ReviewModalProps) => {
  const { productReviewData, isProductReviewLoading, productReviewError } =
    useProfileApi(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      data?.products?._id || data?.id
    );

  console.log({
    data,
    productReviewData,
    isProductReviewLoading,
    productReviewError,
  });

  // const [rating, setRating] = useState(0);
  // const [review, setReview] = useState("");
  const [formFields, setFormFields] = useState(initialFormFields);

  const [hoveredRating, setHoveredRating] = useState(0);

  // const _handleStarClick = (starIndex: number) => {
  //   setRating(starIndex + 1);
  // };

  const _handleFormFieldChange = (
    field: keyof typeof formFields,
    value: any
  ) => {
    setFormFields({ ...formFields, [field]: value });
  };

  const _handleStarHover = (starIndex: number) => {
    setHoveredRating(starIndex + 1);
  };

  const _handleStarLeave = () => {
    setHoveredRating(0);
  };

  const _handleSubmit = () => {
    if (formFields?.rating > 0) {
      onSubmit(formFields?.rating, formFields?.review);
      toggleModal();
    }
  };

  const _renderStars = (ratingValue: number, interactive: boolean = false) => {
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
          onClick={
            interactive
              ? () => _handleFormFieldChange("rating", index + 1)
              : undefined
          }
          onMouseEnter={interactive ? () => _handleStarHover(index) : undefined}
          onMouseLeave={interactive ? _handleStarLeave : undefined}
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
    <Dialog open={isOpen} onOpenChange={toggleModal}>
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
            <h3 className="text-lg font-medium text-gray-900">
              {"productName"}
            </h3>
            <p className="text-sm text-gray-600">
              Share your experience with this product
            </p>
          </div>

          {/* Rating Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Rating</label>
            <div className="flex items-center space-x-1">
              {_renderStars(hoveredRating || formFields?.rating, true)}
            </div>
          </div>

          {/* Review Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Review</label>
            <Textarea
              placeholder="Share your experience with this product..."
              value={formFields?.review}
              onChange={(e) => _handleFormFieldChange("review", e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              onClick={_handleSubmit}
              disabled={formFields?.rating === 0}
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
