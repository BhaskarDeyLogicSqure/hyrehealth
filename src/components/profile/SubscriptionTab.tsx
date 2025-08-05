import React from "react";
import { Card, CardContent } from "../ui/card";
import { Package } from "lucide-react";
import { Button } from "../ui/button";
import SubscriptionCard from "./SubscriptionCard";

const SubscriptionTab = () => {
  // Mock subscription data
  const subscriptions = [
    {
      id: 1,
      productName: "Semaglutide",
      dosage: "0.25mg",
      status: "active",
      price: 299,
      nextBilling: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      nextShipment: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      consultationExpiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      shipmentHistory: [
        {
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          status: "delivered",
        },
        {
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          status: "delivered",
        },
      ],
    },
    {
      id: 2,
      productName: "BPC-157",
      dosage: "5mg",
      status: "active",
      price: 199,
      nextBilling: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      nextShipment: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      consultationExpiry: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      shipmentHistory: [
        {
          date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          status: "delivered",
        },
      ],
    },
    {
      id: 3,
      productName: "NAD+ Therapy",
      dosage: "100mg",
      status: "reconsult_needed",
      price: 349,
      nextBilling: null,
      nextShipment: null,
      consultationExpiry: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      shipmentHistory: [
        {
          date: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000),
          status: "delivered",
        },
        {
          date: new Date(Date.now() - 125 * 24 * 60 * 60 * 1000),
          status: "delivered",
        },
      ],
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {subscriptions?.map((subscription: any) => (
          <SubscriptionCard
            key={subscription?.id}
            subscription={subscription}
          />
        ))}
      </div>

      {/* Add New Subscription */}
      <Card className="mt-8 border-dashed">
        <CardContent className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Add Another Treatment
          </h3>
          <p className="text-gray-600 mb-4">
            Explore our comprehensive range of personalized treatments
          </p>
          <Button
            onClick={() => (window.location.href = "/products")}
            className="bg-brand-dark-blue hover:bg-brand-dark-blue/90"
          >
            Browse Treatments
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default SubscriptionTab;
