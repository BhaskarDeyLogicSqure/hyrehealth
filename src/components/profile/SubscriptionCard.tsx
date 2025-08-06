import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Package } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { CalendarIcon, CheckCircle, AlertTriangle, X } from "lucide-react";
import { formatDate } from "@/lib/dayjs";

import { formatCurrency } from "@/lib/utils";
import { READABLE_DATE_FORMAT, US_SHORT_DATE_FORMAT } from "@/configs";
const SubscriptionCard = ({ subscription }: { subscription: any }) => {
  // Helper functions
  const _getSubscriptionStatusBadge = (
    status: string,
    consultationExpiry: Date
  ) => {
    const now = new Date();
    const isExpiringSoon =
      consultationExpiry?.getTime() - now?.getTime() < 14 * 24 * 60 * 60 * 1000;

    if (status === "reconsult_needed") {
      return <Badge variant="destructive">Reconsult Required</Badge>;
    }
    if (isExpiringSoon && status === "active") {
      return (
        <Badge className="bg-orange-100 text-orange-800">
          Consultation Expires Soon
        </Badge>
      );
    }
    if (status === "active") {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    }
    if (status === "paused") {
      return <Badge variant="secondary">Paused</Badge>;
    }
    return <Badge variant="secondary">{status}</Badge>;
  };

  const _getPricePerMonth = useMemo(() => {
    const price = subscription?._doc?.billing?.amount;
    const duration = subscription?._doc?.plan?.intervalCount;
    const pricePerMonth = price / duration;

    return pricePerMonth;
  }, [subscription]);

  return (
    <Card key={subscription?._doc?.id} className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {subscription?._doc?.product?.name || "N/A"}
              {subscription?._doc?.strength ? (
                <Badge variant="outline">
                  {subscription?._doc?.strength}mg
                </Badge>
              ) : null}
            </CardTitle>
            <p className="text-gray-600 text-sm mt-1">
              {formatCurrency(_getPricePerMonth)}/month
            </p>
          </div>
          {_getSubscriptionStatusBadge(
            subscription?._doc?.status,
            subscription?._doc?.consultationExpiry
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status-specific alerts */}
        {subscription?._doc?.status === "reconsult_needed" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
              <div>
                <h4 className="font-semibold text-red-800">
                  Consultation Required
                </h4>
                <p className="text-red-700 text-sm mt-1">
                  Your consultation expired on{" "}
                  {formatDate(subscription?._doc?.consultationExpiry)}. Complete
                  a new consultation to resume your subscription.
                </p>
                <Button size="sm" className="mt-3 bg-red-600 hover:bg-red-700">
                  Schedule Consultation
                </Button>
              </div>
            </div>
          </div>
        )}

        {subscription?._doc?.status === "active" &&
          subscription?._doc?.consultationExpiry?.getTime() - Date.now() <
            14 * 24 * 60 * 60 * 1000 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-semibold text-orange-800">
                    Consultation Expires Soon
                  </h4>
                  <p className="text-orange-700 text-sm mt-1">
                    Your consultation expires on{" "}
                    {formatDate(subscription?._doc?.consultationExpiry)}.
                    Schedule a renewal to avoid interruption.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 border-orange-300 text-orange-700"
                  >
                    Renew Consultation
                  </Button>
                </div>
              </div>
            </div>
          )}

        {/* Subscription Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Upcoming
            </h4>
            {subscription?._doc?.billing?.nextBillingDate ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Next shipment:</span>
                  <span
                    className="font-medium"
                    title={formatDate(
                      subscription?.nextShipment?.dateOfShipment,
                      READABLE_DATE_FORMAT
                    )}
                  >
                    {subscription?.nextShipment?.dateOfShipment
                      ? formatDate(
                          subscription?.nextShipment?.dateOfShipment,
                          US_SHORT_DATE_FORMAT
                        )
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Next billing:</span>
                  <span
                    className="font-medium"
                    title={formatDate(
                      subscription?._doc?.billing?.nextBillingDate,
                      READABLE_DATE_FORMAT
                    )}
                  >
                    {subscription?._doc?.billing?.nextBillingDate
                      ? formatDate(
                          subscription?._doc?.billing?.nextBillingDate,
                          US_SHORT_DATE_FORMAT
                        )
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Consultation valid until:
                  </span>
                  <span
                    className="font-medium"
                    title={formatDate(
                      subscription?._doc?.billing?.consultationExpiry,
                      READABLE_DATE_FORMAT
                    )}
                  >
                    {subscription?._doc?.consultationExpiry
                      ? formatDate(
                          subscription?._doc?.consultationExpiry,
                          US_SHORT_DATE_FORMAT
                        )
                      : "N/A"}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Subscription paused</p>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Recent Shipments</h4>
            <div className="space-y-2">
              {subscription?.previousShipments?.length > 0 ? (
                subscription?.previousShipments
                  ?.slice(0, 3)
                  ?.map((shipment: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm"
                    >
                      <span
                        className="text-gray-600"
                        title={formatDate(
                          shipment?.dateOfShipment,
                          READABLE_DATE_FORMAT
                        )}
                      >
                        {formatDate(
                          shipment?.dateOfShipment,
                          US_SHORT_DATE_FORMAT
                        )}
                      </span>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-green-600 capitalize">
                          {shipment?.status}
                        </span>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500 text-sm">
                  No previous shipments found
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {/* {subscription?.status === "active" && (
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <SkipShipmentModal subscription={subscription} />
            <PauseSubscriptionModal subscription={subscription} />
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
