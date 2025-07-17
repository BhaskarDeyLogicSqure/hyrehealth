import { useQuery } from "@tanstack/react-query";
import { productApi } from "./productApi";

type ProductFilters = {
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: any; // for future filters
};

const useProductApi = (filterPayload: ProductFilters = {}) => {
  //   console.log({ filterPayload });
  const {
    data: products,
    error: productsError,
    isLoading: isProductsLoading,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["Products", filterPayload], // React Query will cache based on filters
    queryFn: () => productApi.getProducts(filterPayload),
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
    retry: 1, // retry once on failure
  });

  // console.log({ products });

  return {
    // fetch products
    products: products?.data,
    total: products?.total,
    isProductsLoading,
    isProductsError,
    productsError,
    refetchProducts,
  };
};

export default useProductApi;
