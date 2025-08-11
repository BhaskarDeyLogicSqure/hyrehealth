import {
  GET_ALL_INVOICES,
  GET_PROFILE_ENDPOINT,
  GET_USER_SUBSCRIPTIONS,
  CREATE_REVIEW_FOR_PRODUCT,
  GET_SINGLE_PRODUCT_REVIEW,
} from "@/api-helper/ProfileEndpoints";
import apiService from "..";
import { Invoice } from "@/types/profile";

export const profileApi = {
  getProfile: async () => {
    const response = await apiService.get<{
      data: any;
      error: boolean;
    }>(GET_PROFILE_ENDPOINT.endpoint);
    if (response?.error) {
      throw new Error("Failed to load profile");
    }

    return response?.data;
  },

  getUserSubscriptions: async (page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params?.append("page", page?.toString());
    if (limit) params?.append("limit", limit?.toString());

    const queryString = params?.toString();
    const endpoint = queryString
      ? `${GET_USER_SUBSCRIPTIONS.endpoint}?${queryString}`
      : GET_USER_SUBSCRIPTIONS.endpoint;

    const response = await apiService.get<{
      data: any;
      error: boolean;
    }>(endpoint);
    if (response?.error) {
      throw new Error("Failed to load subscriptions");
    }

    return response?.data;
  },

  getAllInvoices: async (
    page?: number,
    limit?: number,
    customerId?: string
  ) => {
    const params = new URLSearchParams();
    if (page) params?.append("page", page?.toString());
    if (limit) params?.append("limit", limit?.toString());
    if (customerId) params?.append("customerId", customerId);

    const queryString = params?.toString();
    const endpoint = queryString
      ? `${GET_ALL_INVOICES.endpoint}?${queryString}`
      : GET_ALL_INVOICES.endpoint;

    const response = await apiService.get<{
      data: Invoice[] | { invoices: Invoice[]; pagination: any };
      error: boolean;
    }>(endpoint);
    if (response?.error) {
      throw new Error("Failed to load invoices");
    }

    return response?.data;
  },

  getSingleProductReview: async (productId: string) => {
    const response = await apiService.get<{
      data: any;
      error: boolean;
      message?: string;
    }>(`${GET_SINGLE_PRODUCT_REVIEW.endpoint}/${productId}`);
    if (response?.error) {
      throw new Error(response?.message || "Failed to load product review");
    }

    return response?.data;
  },

  createReviewForProduct: async (
    productId: string,
    rating: number,
    review: string
  ) => {
    const response = await apiService.post<{
      data: any;
      error: boolean;
      message?: string;
    }>(`${CREATE_REVIEW_FOR_PRODUCT.endpoint}`, {
      productId,
      rating,
      reviewText: review,
    });

    if (response?.error) {
      throw new Error(response?.message || "Failed to create review");
    }

    return response?.data;
  },
};
