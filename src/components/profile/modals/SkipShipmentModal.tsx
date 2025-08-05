import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SkipShipmentModal = ({ subscription }: { subscription: any }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Skip Next
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Skip Next Shipment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">
            You're about to skip your next shipment of{" "}
            {subscription?.productName}. Your billing date will be pushed back
            by one month.
          </p>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> You can only skip up to 2 consecutive
              shipments before requiring a new consultation.
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-brand-dark-blue hover:bg-brand-dark-blue/90">
              Confirm Skip
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SkipShipmentModal;
