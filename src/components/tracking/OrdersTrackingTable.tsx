import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Truck, Eye } from "lucide-react";

export interface TrackingOrder {
  id: string;
  orderNumber: string;
  items: string;
  orderDate: string;
  status: "placed" | "fulfilled" | "shipped" | "delivered";
  trackingNumber?: string;
  estimatedDelivery?: string;
  shippingCarrier?: string;
  recipientCount: number;
}

interface OrdersTrackingTableProps {
  orders: TrackingOrder[];
  onViewOrderDetails: (order: TrackingOrder) => void;
}

const OrdersTrackingTable: React.FC<OrdersTrackingTableProps> = ({
  orders,
  onViewOrderDetails,
}) => {
  const getStatusBadge = (status: string) => {
    const configs = {
      placed: { color: "bg-blue-100 text-blue-800", label: "Placed" },
      fulfilled: { color: "bg-yellow-100 text-yellow-800", label: "Fulfilled" },
      shipped: { color: "bg-purple-100 text-purple-800", label: "Shipped" },
      delivered: { color: "bg-green-100 text-green-800", label: "Delivered" },
    };

    const config = configs[status as keyof typeof configs];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getCarrierTrackingDisplay = (order: TrackingOrder) => {
    if (order.shippingCarrier && order.trackingNumber) {
      return `${order.shippingCarrier} – ${order.trackingNumber}`;
    } else if (order.shippingCarrier) {
      return order.shippingCarrier;
    }
    return "N/A";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders ({orders.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Carrier & Tracking</TableHead>
              <TableHead>Est. Delivery</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell
                  className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                  onClick={() => onViewOrderDetails(order)}
                >
                  {order.orderNumber}
                </TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>{order.recipientCount} recipients</TableCell>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Truck className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {getCarrierTrackingDisplay(order)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{order.estimatedDelivery}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewOrderDetails(order)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {orders.length === 0 && (
          <div className="text-center py-8">
            <Truck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500">
              Your orders will appear here once you place them
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersTrackingTable;
