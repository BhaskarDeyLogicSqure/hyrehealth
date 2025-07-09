import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Clock, Truck, MapPin } from "lucide-react";

interface TrackingSummaryProps {
  placedCount: number;
  fulfilledCount: number;
  shippedCount: number;
  deliveredCount: number;
}

const TrackingSummary: React.FC<TrackingSummaryProps> = ({
  placedCount,
  fulfilledCount,
  shippedCount,
  deliveredCount,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Orders Placed</p>
              <p className="text-2xl font-bold text-blue-600">{placedCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Orders Fulfilled</p>
              <p className="text-2xl font-bold text-yellow-600">
                {fulfilledCount}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Truck className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Orders Shipped</p>
              <p className="text-2xl font-bold text-purple-600">
                {shippedCount}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Orders Delivered</p>
              <p className="text-2xl font-bold text-green-600">
                {deliveredCount}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackingSummary;
