import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "./categoryApi";

type CategoryFilters = {
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: any; // for future filters
};

const useCategoryApi = (filterPayload: CategoryFilters = {}) => {
  //   console.log({ filterPayload });
  const {
    data: categories,
    error: categoriesError,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["Categories", filterPayload], // React Query will cache based on filters
    queryFn: () => categoryApi.getCategories(filterPayload),
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
    retry: 1, // retry once on failure
  });

  //   console.log({ categories });

  return {
    // fetch categories
    categories: categories?.data,
    total: categories?.total,
    isCategoriesLoading,
    isCategoriesError,
    categoriesError,
    refetchCategories,
  };
};

export default useCategoryApi;
