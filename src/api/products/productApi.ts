import apiService from "..";
import { BASE_URL } from "@/configs";
import { Product } from "@/types/products";
import {
  GET_PRODUCTS_ENDPOINT,
  GET_SINGLE_PRODUCT_ENDPOINT,
} from "@/api-helper/ProductEndpoints";

export interface ProductFilters {
  search?: string;
  type?: string;
  isActive?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

export const productApi = {
  getProducts: async (
    filters: ProductFilters = {},
    origin: string = ""
  ): Promise<{
    data: Product[];
    total: number;
  }> => {
    // Clean up undefined values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters)?.filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );

    const response = await apiService.get<{
      data: {
        products: Product[];
        total: number;
        page: number;
        pages: number;
      };
      error: boolean;
    }>(`${BASE_URL}${GET_PRODUCTS_ENDPOINT?.endpoint}`, {
      ...cleanFilters,
      origin,
    });

    return {
      data: response?.data?.products,
      total: response?.data?.total,
    };
  },

  // Get single product
  getProductById: async (id: string, origin: string = ""): Promise<Product> => {
    const response = await apiService.get<{
      data: {
        product: Product;
      };
      error: boolean;
      message?: string;
    }>(`${BASE_URL}${GET_SINGLE_PRODUCT_ENDPOINT?.endpoint}/${id}/${origin}`);

    if (response?.error) {
      throw new Error(response?.message);
    }
    return response?.data?.product;
  },

  getFeaturedProducts: async (): Promise<{
    data: Product[];
    total: number;
  }> => {
    const response = await apiService.get<{
      data: {
        products: Product[];
        total: number;
      };
      error: boolean;
    }>(`${BASE_URL}${GET_PRODUCTS_ENDPOINT?.endpoint}`, {
      isPopular: true,
      limit: 3,
    });

    return {
      data: response?.data?.products,
      total: response?.data?.total,
    };
  },
};
