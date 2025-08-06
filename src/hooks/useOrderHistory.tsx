import { DEFAULT_IMAGE_URL } from "@/configs";
import { useState } from "react";
import { useProfileApi } from "@/api/profile/useProfileApi";
import { Badge } from "@/components/ui/badge";

const useOrderHistory = (customerId: string) => {
  const [dataPayload, setDataPayload] = useState({
    page: 1,
    limit: 10,
  });

  const {
    invoicesData: orders,
    isInvoicesLoading,
    invoicesError,
    isInvoicesError,
  } = useProfileApi(
    dataPayload?.page,
    dataPayload?.limit,
    undefined,
    undefined,
    customerId
  );

  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    order: null,
  });
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>(
    {}
  );
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  console.log({ orders });

  // Handle pagination data structure
  const ordersList = Array.isArray(orders) ? orders : orders?.invoices || [];
  const paginationData = Array.isArray(orders) ? null : orders?.pagination;

  // Calculate pagination
  const totalItems = paginationData?.total || ordersList?.length || 0;

  const _handlePageChange = (page: number = 1) => {
    setDataPayload({ ...dataPayload, page });
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const _getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "refunded":
        return <Badge className="bg-red-100 text-red-800">Refunded</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const _toggleReviewModal = (isOpen: boolean = false, order: any = null) => {
    setReviewModal({ isOpen, order });
  };

  const _handleReviewSubmit = (rating: number, review: string) => {
    // Here you would typically make an API call to save the review
    console.log("Review submitted:", {
      rating,
      review,
      //   orderId: reviewModal?.order?._doc?._id,
    });

    // Update the order with the new review (in a real app, this would be done via API)
    // For now, we'll just log it
  };

  const _toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const _handleImageError = (imageUrl: string) => {
    setFailedImages((prev) => new Set(prev).add(imageUrl));
  };

  const _getImageSrc = (imageUrl: string) => {
    if (!imageUrl || failedImages.has(imageUrl)) {
      return DEFAULT_IMAGE_URL;
    }
    return imageUrl;
  };

  return {
    ordersList,
    totalItems,
    dataPayload,
    reviewModal,
    expandedOrders,
    isInvoicesLoading,
    invoicesError,
    isInvoicesError,
    handlePageChange: _handlePageChange,
    getOrderStatusBadge: _getOrderStatusBadge,
    toggleReviewModal: _toggleReviewModal,
    handleReviewSubmit: _handleReviewSubmit,
    toggleOrderExpansion: _toggleOrderExpansion,
    handleImageError: _handleImageError,
    getImageSrc: _getImageSrc,
  };
};

export default useOrderHistory;
