"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { showErrorToast } from "../GlobalErrorHandler";
import ThemeLoader from "../ThemeLoader";

interface ReviewModalProps {
  isOpen: boolean;
  data: any;
  isCreateReviewLoading: boolean;
  createReviewError?: any;
  toggleModal: () => void;
  onSubmit: (rating: number, review: string, productId: string) => void;
}

const initialFormFields = {
  rating: 0,
  review: "",
};

const ReviewModal = ({
  isOpen,
  data,
  isCreateReviewLoading,
  toggleModal,
  onSubmit,
}: ReviewModalProps) => {
  // currently only one product is supported when creating a review, which is the main product if available, otherwise the first product
  const _getMainProduct = useMemo(() => {
    const mainProduct = data?.products?.find(
      (product: any) => product?.isPrimary
    );

    // if no main product is found, return the first product
    if (!mainProduct) {
      return data?.products?.[0];
    }
    return mainProduct;
  }, [data]);

  const { productReviewData, isProductReviewLoading, productReviewError } =
    useProfileApi(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      _getMainProduct?._id,
      data?._id
    );

  console.log({
    productReviewData,
    isProductReviewLoading,
    productReviewError,
  });

  const [formFields, setFormFields] = useState(initialFormFields);

  const [hoveredRating, setHoveredRating] = useState(0);

  const _handleFormFieldChange = (
    field: keyof typeof formFields,
    value: any
  ) => {
    if (field === "review") {
      // Enforce max 200 chars for review
      if (typeof value === "string") {
        if (value?.length > 200) {
          value = value?.slice(0, 200);
          showErrorToast("Review must be less than 200 characters");
        }
        setFormFields({ ...formFields, [field]: value });
      }
    } else {
      setFormFields({ ...formFields, [field]: value });
    }
  };

  const _handleStarHover = (starIndex: number) => {
    setHoveredRating(starIndex + 1);
  };

  const _handleStarLeave = () => {
    setHoveredRating(0);
  };

  const _handleSubmit = () => {
    if (!formFields?.rating) {
      showErrorToast("Please select a rating");
      return;
    }

    onSubmit(formFields?.rating, formFields?.review, _getMainProduct?._id);
    toggleModal();
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

  // useEffect(() => {
  //   if (productReviewError) {
  //     showErrorToast("Review not found");
  //   }
  // }, [productReviewError]);

  useEffect(() => {
    if (productReviewData) {
      const reviewData = productReviewData?.reviews?.[0];

      setFormFields({
        rating: reviewData?.rating,
        review: reviewData?.reviewText,
      });
    }
  }, [productReviewData]);

  return (
    <Dialog open={isOpen} onOpenChange={toggleModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              Rate & Review Product{" "}
              {isProductReviewLoading ? (
                <ThemeLoader type="inline" variant="simple" size="sm" />
              ) : null}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Name */}
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {_getMainProduct?.name || "Product"}
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
              disabled={isCreateReviewLoading}
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
