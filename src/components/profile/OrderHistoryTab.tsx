import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Package,
  Receipt,
  Truck,
  RotateCcw,
  Eye,
  MessageSquare,
} from "lucide-react";
import { formatDate } from "@/lib/dayjs";
import { Button } from "../ui/button";
import {
  DEFAULT_IMAGE_URL,
  DIGITS_AFTER_DECIMALS,
  US_SHORT_DATE_FORMAT,
} from "@/configs";
import { Badge } from "../ui/badge";
import ReviewModal from "./ReviewModal";
import { useProfileApi } from "@/api/profile/useProfileApi";
import CustomPagination from "@/components/CustomPagination";
import ThemeLoader from "@/components/ThemeLoader";

const OrderHistoryTab = () => {
  const [dataPayload, setDataPayload] = useState({
    page: 1,
    limit: 10,
  });

  const {
    invoicesData: orders,
    isInvoicesLoading,
    invoicesError,
    isInvoicesError,
  } = useProfileApi(dataPayload?.page, dataPayload?.limit);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
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
    console.log({ status });
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

  const handleReviewClick = (order: any) => {
    setSelectedOrder(order);
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = (rating: number, review: string) => {
    // Here you would typically make an API call to save the review
    console.log("Review submitted:", {
      rating,
      review,
      orderId: selectedOrder?.id,
    });

    // Update the order with the new review (in a real app, this would be done via API)
    // For now, we'll just log it
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleImageError = (imageUrl: string) => {
    setFailedImages((prev) => new Set(prev).add(imageUrl));
  };

  const getImageSrc = (imageUrl: string) => {
    if (!imageUrl || failedImages.has(imageUrl)) {
      return DEFAULT_IMAGE_URL;
    }
    return imageUrl;
  };

  // Component to render multiple products
  const _renderProducts = (
    products: any[],
    isMobile: boolean = false,
    orderId?: string
  ) => {
    if (!products || products.length === 0) {
      return (
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">No products found</div>
        </div>
      );
    }

    if (products?.length === 1) {
      const product = products?.[0];
      return (
        <div className="flex items-center gap-3">
          <img
            src={getImageSrc(product?.images?.[0])}
            alt={product?.name || "Product"}
            className={`${
              isMobile ? "w-12 h-12" : "w-10 h-10"
            } rounded object-cover`}
            onError={() => handleImageError(product?.images?.[0])}
          />
          <div>
            <div className="font-medium">{product?.name || "Product"}</div>
            <div className="text-sm text-gray-500">
              {product?.strength ? `${product?.strength}mg` : "N/A"}
            </div>
          </div>
        </div>
      );
    }

    // Multiple products with show more toggle
    const isExpanded = orderId ? expandedOrders[orderId] : false;
    const displayedProducts = isExpanded ? products : products?.slice(0, 1);
    const hasMoreProducts = products?.length > 1;

    return (
      <div className="space-y-2">
        {displayedProducts?.map((product, index) => (
          <div key={index} className="flex items-center gap-3">
            <img
              src={getImageSrc(product?.images?.[0])}
              alt={product?.name || "Product"}
              className={`${
                isMobile ? "w-12 h-12" : "w-10 h-10"
              } rounded object-cover`}
              onError={() => handleImageError(product?.images?.[0])}
            />
            <div className="flex-1">
              <div className="font-medium">{product?.name || "Product"}</div>
              <div className="text-sm text-gray-500">
                {product?.strength ? `${product?.strength}mg` : "N/A"}
              </div>
            </div>
          </div>
        ))}

        {hasMoreProducts && orderId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleOrderExpansion(orderId)}
            className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto"
          >
            {isExpanded
              ? `Show less`
              : `Show ${products?.length - 1} more product${
                  products?.length - 1 > 1 ? "s" : ""
                }`}
          </Button>
        )}
      </div>
    );
  };

  // Loading state
  if (isInvoicesLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <ThemeLoader variant="full-page" />
      </div>
    );
  }

  // Error state
  if (isInvoicesError) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Package className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Orders
          </h3>
          <p className="text-gray-600 mb-4">
            {invoicesError?.message || "Failed to load your order history"}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-brand-dark-blue hover:bg-brand-dark-blue/90"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Your Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {ordersList?.map((order: any) => (
                  <TableRow key={order?._id || order?.id}>
                    <TableCell className="font-medium">
                      {order?.invoiceNumber || "N/A"}
                    </TableCell>
                    <TableCell>
                      {_renderProducts(
                        order?.products || [],
                        false,
                        order?._id || order?.id
                      )}
                    </TableCell>
                    <TableCell>
                      {order?.date
                        ? formatDate(order?.date, US_SHORT_DATE_FORMAT)
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      ${order?.total?.toFixed(DIGITS_AFTER_DECIMALS)}
                    </TableCell>
                    <TableCell>{_getOrderStatusBadge(order?.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Receipt className="h-4 w-4 mr-1" />
                          Invoice
                        </Button>
                        {order?.trackingNumber && (
                          <Button variant="outline" size="sm">
                            <Truck className="h-4 w-4 mr-1" />
                            Track
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReviewClick(order)}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Reviews
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {ordersList?.map((order: any) => (
          <Card key={order?._id || order?.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {order?.invoiceNumber || "N/A"}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {order?.date
                      ? formatDate(order?.date, US_SHORT_DATE_FORMAT)
                      : "N/A"}
                  </p>
                </div>
                {_getOrderStatusBadge(order?.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {_renderProducts(
                  order?.products || [],
                  true,
                  order?._id || order?.id
                )}
                <div className="text-lg font-semibold">
                  ${order?.total?.toFixed(DIGITS_AFTER_DECIMALS)}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Receipt className="h-4 w-4 mr-1" />
                  Invoice
                </Button>
                {order?.trackingNumber && (
                  <Button variant="outline" size="sm">
                    <Truck className="h-4 w-4 mr-1" />
                    Track
                  </Button>
                )}
                {order?.canReorder && (
                  <Button variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reorder
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReviewClick(order)}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Reviews
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="mt-8">
          <CustomPagination
            currentPage={dataPayload?.page}
            totalItems={totalItems}
            itemsPerPage={dataPayload?.limit}
            onPageChange={_handlePageChange}
            showInfo={true}
            maxVisiblePages={5}
          />
        </div>
      )}

      {/* Empty State */}
      {totalItems == 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Orders Yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start your health journey with our personalized treatments
            </p>
            <Button
              onClick={() => (window.location.href = "/products")}
              className="bg-brand-dark-blue hover:bg-brand-dark-blue/90"
            >
              Browse Treatments
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        productName={
          selectedOrder?.products?.[0]?.name || selectedOrder?.productName || ""
        }
        currentReview={selectedOrder?.review}
        onSubmit={handleReviewSubmit}
      />
    </>
  );
};

export default OrderHistoryTab;
