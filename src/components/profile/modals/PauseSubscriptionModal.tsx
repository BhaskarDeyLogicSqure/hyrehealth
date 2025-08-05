import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pause } from "lucide-react";

const PauseSubscriptionModal = ({ subscription }: { subscription: any }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-orange-600">
          <Pause className="h-4 w-4 mr-1" />
          Pause
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pause Subscription</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">
            How long would you like to pause your {subscription?.productName}{" "}
            subscription?
          </p>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select pause duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 month</SelectItem>
              <SelectItem value="2">2 months</SelectItem>
              <SelectItem value="3">3 months</SelectItem>
            </SelectContent>
          </Select>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Important:</strong> Pausing for more than 3 months will
              require a new consultation to resume.
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-orange-600 hover:bg-orange-700">
              Pause Subscription
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PauseSubscriptionModal;
