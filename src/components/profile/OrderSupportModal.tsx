"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ThemeLoader from "@/components/ThemeLoader";
import { useOrderSupportApi } from "@/api/support/useSupportApi";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/GlobalErrorHandler";
import { formatDate } from "@/lib/dayjs";
import { US_DATE_TIME_FORMAT } from "@/configs";
import type { OrderSupportPriority } from "@/api/support/supportApi";

interface OrderSupportModalProps {
  isOpen: boolean;
  order: any;
  toggleModal: () => void;
}

const PRIORITY_OPTIONS: { label: string; value: OrderSupportPriority }[] = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

const ISSUE_DETAILS_MAX_LENGTH = 1000;

const getPriorityBadge = (priority?: string) => {
  switch (priority) {
    case "high":
      return <Badge className="bg-red-100 text-red-800">High</Badge>;
    case "medium":
      return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
    case "low":
      return <Badge className="bg-green-100 text-green-800">Low</Badge>;
    default:
      return <Badge variant="secondary">{priority || "N/A"}</Badge>;
  }
};

const getStatusBadge = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "open":
      return <Badge className="bg-blue-100 text-blue-800">Open</Badge>;
    case "in_progress":
    case "in-progress":
      return <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>;
    case "resolved":
    case "closed":
      return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
    default:
      return <Badge variant="secondary">{status || "N/A"}</Badge>;
  }
};

const OrderSupportModal = ({
  isOpen,
  order,
  toggleModal,
}: OrderSupportModalProps) => {
  const orderId = order?._id || order?.id;

  const {
    orderSupportData,
    isOrderSupportLoading,
    createOrderSupport,
    isCreateOrderSupportLoading,
  } = useOrderSupportApi(orderId, isOpen);

  const [priority, setPriority] = useState<OrderSupportPriority | "">("");
  const [issueDetails, setIssueDetails] = useState("");

  const _handleSubmit = async () => {
    if (!priority) {
      showErrorToast("Please select a priority");
      return;
    }

    const trimmedIssue = issueDetails?.trim();
    if (!trimmedIssue) {
      showErrorToast("Please describe your issue");
      return;
    }

    try {
      await createOrderSupport({
        orderId,
        priority,
        issueDetails: trimmedIssue,
      });
      showSuccessToast("Support request submitted successfully");
      toggleModal();
    } catch {
      // error toast already handled inside the mutation
    }
  };

  const _renderExistingTicket = () => (
    <div className="space-y-4">
      <div className="rounded-md border bg-muted/30 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm">
            <span className="text-gray-500">Ticket: </span>
            <span className="font-medium text-gray-900">
              {orderSupportData?.ticketNumber}
            </span>
          </div>
          {getStatusBadge(orderSupportData?.status)}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500 mb-1">Priority</p>
            {getPriorityBadge(orderSupportData?.priority)}
          </div>
          <div>
            <p className="text-gray-500 mb-1">Created</p>
            <p className="text-gray-900">
              {orderSupportData?.createdAt
                ? formatDate(orderSupportData?.createdAt, US_DATE_TIME_FORMAT)
                : "N/A"}
            </p>
          </div>
        </div>

        <div>
          <p className="text-gray-500 text-sm mb-1">Issue Details</p>
          <p className="whitespace-pre-wrap text-sm text-gray-900">
            {orderSupportData?.issueDetails || "—"}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        A support request has already been submitted for this order. Only one
        support request is allowed per order.
      </p>
    </div>
  );

  const _renderForm = () => (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Priority</label>
        <Select
          value={priority}
          onValueChange={(value) => setPriority(value as OrderSupportPriority)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {PRIORITY_OPTIONS.map((option) => (
              <SelectItem key={option?.value} value={option?.value}>
                {option?.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Issue Details
        </label>
        <Textarea
          placeholder="Please describe the issue you are facing with this order..."
          value={issueDetails}
          onChange={(e) =>
            setIssueDetails(e.target.value?.slice(0, ISSUE_DETAILS_MAX_LENGTH))
          }
          className="min-h-[120px] resize-none"
        />
        <p className="text-xs text-gray-500 text-right">
          {issueDetails?.length || 0}/{ISSUE_DETAILS_MAX_LENGTH}
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={toggleModal}
          disabled={isCreateOrderSupportLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={_handleSubmit}
          disabled={isCreateOrderSupportLoading}
        >
          {isCreateOrderSupportLoading ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={toggleModal}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            Order Support
            {isOrderSupportLoading ? (
              <ThemeLoader type="inline" variant="simple" size="sm" />
            ) : null}
          </DialogTitle>
          <DialogDescription>
            {order?.invoiceNumber
              ? `Order ${order?.invoiceNumber}`
              : "Submit a support request for this order"}
          </DialogDescription>
        </DialogHeader>

        {isOrderSupportLoading ? (
          <div className="flex justify-center py-8">
            <ThemeLoader type="inline" variant="simple" size="md" />
          </div>
        ) : orderSupportData?.ticketNumber ? (
          _renderExistingTicket()
        ) : (
          _renderForm()
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderSupportModal;
