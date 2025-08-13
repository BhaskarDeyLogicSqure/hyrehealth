import { DEFAULT_IMAGE_URL } from "@/configs";
import { useMemo, useState } from "react";
import { useProfileApi } from "@/api/profile/useProfileApi";
import { Badge } from "@/components/ui/badge";

const useOrderHistory = (customerId: string) => {
  const [dataPayload, setDataPayload] = useState({
    page: 1,
    limit: 10,
  });

  const memoizedDataPayload = useMemo(
    () => ({
      page: dataPayload?.page,
      limit: dataPayload?.limit,
    }),
    [dataPayload?.page, dataPayload?.limit]
  );

  const {
    // invoices api hook
    invoicesData: orders,
    isInvoicesLoading,
    invoicesError,
    isInvoicesError,
    // create review for product api hook
    createReviewForProduct,
    isCreateReviewLoading,
    createReviewError,
  } = useProfileApi(
    memoizedDataPayload?.page,
    memoizedDataPayload?.limit,
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
    setDataPayload({ ...memoizedDataPayload, page });
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

  const _handleReviewSubmit = async (
    rating: number,
    review: string,
    productId: string
  ) => {
    // Here you would typically make an API call to save the review
    console.log("Review submitted:", {
      rating,
      review,
      productId,
      //   orderId: reviewModal?.order?._doc?._id,
    });

    await createReviewForProduct({
      productId,
      rating,
      review,
    });
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
    dataPayload: memoizedDataPayload,
    reviewModal,
    expandedOrders,
    isInvoicesLoading,
    invoicesError,
    isInvoicesError,
    isCreateReviewLoading,
    createReviewError,
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
