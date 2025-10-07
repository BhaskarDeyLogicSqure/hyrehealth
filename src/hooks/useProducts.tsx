import { Category } from "@/types/categories";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import useProductApi from "@/api/products/useProductApi";
import useCategoryApi from "@/api/categories/useCategoryApi";
import { showErrorToast } from "@/components/GlobalErrorHandler";
import { useProductsUrlParams } from "./useUrlParams";

interface useProductsHookProps {
  fdaApproved?: boolean;
}

const useProducts = ({ fdaApproved = false }: useProductsHookProps) => {
  const searchRef = useRef<NodeJS.Timeout | null>(null);

  // Use URL params hook for state management
  const {
    params: filters,
    updateParam,
    setSearch: setUrlSearch,
    setPage: setUrlPage,
    resetParams,
    hasNonDefaultValue,
  } = useProductsUrlParams(fdaApproved);

  const [search, setSearch] = useState<string>(filters.search || ""); // need a different state for search, as search is being debounced

  const [products, setProducts] = useState<Record<string, any>>({
    data: [],
    total: 0,
  });

  // Check if any filters are active (non-default values)
  const hasActiveFilters = useMemo(() => {
    return (
      hasNonDefaultValue("search") ||
      hasNonDefaultValue("category") ||
      hasNonDefaultValue("sort")
    );
  }, [hasNonDefaultValue]);

  // get origin from headers
  const origin = window.location.origin || "";
  const {
    products: productsResponse,
    total: totalResponse,
    isProductsLoading,
    isProductsError,
    productsError,
  } = useProductApi(filters, origin); // filters is being passed as a dependency in useProductApi, will make a new api call whenever the filters are updated

  // display error toast if there is an error
  if (isProductsError) {
    showErrorToast(productsError?.message || "Something went wrong");
  }

  const { categories: categoriesResponse } = useCategoryApi();

  // console.log("productsResponse", { productsResponse });

  const _handleOnChangeFilters = (key: string, value: string) => {
    // if the user is searching, we want to debounce the search
    if (key === "search") {
      setSearch(value);
      if (searchRef.current) clearTimeout(searchRef.current);

      searchRef.current = setTimeout(() => {
        setUrlSearch(value);
      }, 500);
    } else {
      // if the user is not searching, we want to update the URL immediately
      updateParam(key as keyof typeof filters, value, true);
    }
  };

  const _getCategoryNameFromId = useCallback(
    (categoryId: string) => {
      const category = categoriesResponse?.find(
        (category: Category) => category?._id === categoryId
      );
      return category?.name;
    },
    [categoriesResponse]
  );

  const _onPageChange = (page: number) => {
    setUrlPage(page);
  };

  // Handle reset filters
  const _handleResetFilters = () => {
    resetParams();
  };

  // Sync search state with URL when filters change
  useEffect(() => {
    if (filters.search !== search) {
      setSearch(filters.search || "");
    }
  }, [filters.search]);

  useEffect(() => {
    if (productsResponse) {
      console.log("productsResponse", productsResponse);
      setProducts({
        data: productsResponse,
        total: totalResponse,
      });
    }
  }, [productsResponse]);

  return {
    products,
    filters,
    search,
    categories: categoriesResponse,
    isProductsLoading,
    hasActiveFilters,
    handleOnChangeFilters: _handleOnChangeFilters,
    getCategoryNameFromId: _getCategoryNameFromId,
    onPageChange: _onPageChange,
    handleResetFilters: _handleResetFilters,
  };
};

export default useProducts;
