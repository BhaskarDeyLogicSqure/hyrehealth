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
    filters: ProductFilters = {}
  ): Promise<{
    data: Product[];
    total: number;
  }> => {
    // console.log("making fetch categories call with filters:", filters);

    // Clean up undefined values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(
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
    }>(`${BASE_URL}${GET_PRODUCTS_ENDPOINT?.endpoint}`, cleanFilters);

    // console.log("categories response:", { response });
    return {
      data: response?.data?.products,
      total: response?.data?.total,
    };
  },

  // Get single product
  getProductById: async (id: string): Promise<Product> => {
    const response = await apiService.get<Product>(
      `${BASE_URL}${GET_SINGLE_PRODUCT_ENDPOINT?.endpoint}/${id}`
    );
    return response;
  },

  // Search categories (for autocomplete/search)
  // searchCategories: async (query: string, limit = 10): Promise<Category[]> => {
  //   if (!query.trim()) return [];

  //   const response = await apiService.get<{
  //     data: Category[];
  //   }>(`${GET_CATEGORIES_ENDPOINT?.endpoint}/search`, { q: query, limit });

  //   return response.data || [];
  // },
};
