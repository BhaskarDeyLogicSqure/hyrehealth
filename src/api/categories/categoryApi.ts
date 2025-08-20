import { GET_CATEGORIES_ENDPOINT } from "@/api-helper/CategoryEndpoints";
import apiService from "..";
import { Category } from "@/types/categories";
import { BASE_URL, FEATURED_CATEGORIES_LIMIT } from "@/configs";

export interface CategoryFilters {
  search?: string;
  type?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export const categoryApi = {
  getCategories: async (
    filters: CategoryFilters = {},
    origin: string = ""
  ): Promise<{
    data: Category[];
    total: number;
  }> => {
    // console.log("making fetch categories call with filters:", filters);

    // Clean up undefined values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );

    cleanFilters["origin"] = origin;

    const response = await apiService.get<{
      data: {
        categories: Category[];
        total: number;
        page: number;
        pages: number;
      };
      error: boolean;
    }>(BASE_URL + GET_CATEGORIES_ENDPOINT?.endpoint, cleanFilters);

    // console.log("categories response:", { response });
    return {
      data: response?.data?.categories,
      total: response?.data?.total,
    };
  },

  getFeaturedCategories: async (
    origin: string = ""
  ): Promise<{
    data: Category[];
    total: number;
  }> => {
    const response = await apiService.get<{
      data: {
        categories: Category[];
        total: number;
      };
      error: boolean;
    }>(`${GET_CATEGORIES_ENDPOINT?.endpoint}`, {
      isPopular: true,
      limit: FEATURED_CATEGORIES_LIMIT,
      origin,
    });
    return {
      data: response?.data?.categories,
      total: response?.data?.total,
    };
  },

  // Get single category
  // getCategory: async (id: string): Promise<Category> => {
  //   const response = await apiService.get<Category>(
  //     `${GET_CATEGORIES_ENDPOINT?.endpoint}/${id}`
  //   );
  //   return response;
  // },

  // Search categories (for autocomplete/search)
  // searchCategories: async (query: string, limit = 10): Promise<Category[]> => {
  //   if (!query.trim()) return [];

  //   const response = await apiService.get<{
  //     data: Category[];
  //   }>(`${GET_CATEGORIES_ENDPOINT?.endpoint}/search`, { q: query, limit });

  //   return response.data || [];
  // },
};
