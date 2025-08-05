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
import { DIGITS_AFTER_DECIMALS } from "@/configs";
import { Badge } from "../ui/badge";
import ReviewModal from "./ReviewModal";

const OrderHistoryTab = () => {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Mock order data
  const orders = [
    {
      id: "ORD-2024-001",
      date: new Date("2024-01-15"),
      productName: "Semaglutide",
      dosage: "0.25mg",
      total: 299.0,
      status: "delivered",
      trackingNumber: "1Z999AA1234567890",
      canReorder: true,
      image: "https://placehold.co/600x400",
      review: {
        rating: 4,
        review: "qwerthsdfgb",
      },
    },
    {
      id: "ORD-2024-002",
      date: new Date("2024-02-18"),
      productName: "BPC-157",
      dosage: "5mg",
      total: 199.0,
      status: "in_progress",
      trackingNumber: "1Z999BB1234567891",
      canReorder: true,
      image: "https://placehold.co/600x400",
      review: null,
    },
    {
      id: "ORD-2023-089",
      date: new Date("2023-12-10"),
      productName: "NAD+ Therapy",
      dosage: "100mg",
      total: 349.0,
      status: "refunded",
      trackingNumber: null,
      canReorder: false,
      image: "https://placehold.co/600x400",
      review: null,
    },
  ];

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "refunded":
        return <Badge className="bg-red-100 text-red-800">Refunded</Badge>;
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
                  <TableHead>Product</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {orders?.map((order: any) => (
                  <TableRow key={order?.id}>
                    <TableCell className="font-medium">{order?.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={order?.image}
                          alt={order?.productName}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <div className="font-medium">
                            {order?.productName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order?.dosage}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(order?.date)}</TableCell>
                    <TableCell>
                      ${order?.total?.toFixed(DIGITS_AFTER_DECIMALS)}
                    </TableCell>
                    <TableCell>{getOrderStatusBadge(order?.status)}</TableCell>
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
        {orders?.map((order: any) => (
          <Card key={order?.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{order?.id}</CardTitle>
                  <p className="text-sm text-gray-600">
                    {formatDate(order?.date)}
                  </p>
                </div>
                {getOrderStatusBadge(order?.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={order?.image}
                  alt={order?.productName}
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <div className="font-medium">{order?.productName}</div>
                  <div className="text-sm text-gray-500">{order?.dosage}</div>
                  <div className="text-lg font-semibold">
                    ${order?.total?.toFixed(DIGITS_AFTER_DECIMALS)}
                  </div>
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

      {/* Empty State */}
      {orders?.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Orders Yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start your health journey with our personalized treatments
            </p>
            <Button onClick={() => (window.location.href = "/products")}>
              Browse Treatments
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        productName={selectedOrder?.productName || ""}
        currentReview={selectedOrder?.review}
        onSubmit={handleReviewSubmit}
      />
    </>
  );
};

export default OrderHistoryTab;
