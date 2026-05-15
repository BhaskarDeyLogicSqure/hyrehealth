import apiService from "..";
import {
  CREATE_ORDER_SUPPORT,
  GET_ORDER_SUPPORT,
} from "@/api-helper/SupportEndpoints";

export type OrderSupportPriority = "low" | "medium" | "high";

export interface OrderSupportTicket {
  ticketNumber: string;
  status: string;
  priority: OrderSupportPriority;
  issueDetails: string;
  createdAt: string;
}

export interface CreateOrderSupportPayload {
  orderId: string;
  priority: OrderSupportPriority;
  issueDetails: string;
}

export const supportApi = {
  getOrderSupport: async (
    orderId: string
  ): Promise<OrderSupportTicket | null> => {
    const response = await apiService.get<{
      data: OrderSupportTicket | null;
      error: boolean;
      message?: string;
    }>(`${GET_ORDER_SUPPORT.endpoint}/${orderId}`);

    if (response?.error) {
      throw new Error(response?.message || "Failed to load support ticket");
    }

    return response?.data ?? null;
  },

  createOrderSupport: async (
    payload: CreateOrderSupportPayload
  ): Promise<OrderSupportTicket> => {
    const response = await apiService.post<{
      data: OrderSupportTicket;
      error: boolean;
      message?: string;
    }>(CREATE_ORDER_SUPPORT.endpoint, payload);

    if (response?.data?.error) {
      throw new Error(
        response?.data?.message || "Failed to create support ticket"
      );
    }

    return response?.data?.data as OrderSupportTicket;
  },
};
