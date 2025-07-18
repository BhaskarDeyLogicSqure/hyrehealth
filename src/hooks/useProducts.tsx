import { Category } from "@/types/categories";
import { useEffect, useRef, useState, useCallback } from "react";
import useProductApi from "@/api/products/useProductApi";
import useCategoryApi from "@/api/categories/useCategoryApi";
import { errorToast } from "@/utils/toasters";
import { useProductsUrlParams } from "./useUrlParams";

const useProducts = () => {
  const searchRef = useRef<NodeJS.Timeout | null>(null);

  // Use URL params hook for state management
  const {
    params: filters,
    updateParam,
    setSearch: setUrlSearch,
    setPage: setUrlPage,
  } = useProductsUrlParams();

  const [search, setSearch] = useState<string>(filters.search || ""); // need a different state for search, as search is being debounced

  const [products, setProducts] = useState<Record<string, any>>({
    data: [],
    total: 0,
  });

  const {
    products: productsResponse,
    total: totalResponse,
    isProductsLoading,
    isProductsError,
    productsError,
  } = useProductApi(filters); // filters is being passed as a dependency in useProductApi, will make a new api call whenever the filters are updated

  // display error toast if there is an error
  if (isProductsError) {
    errorToast(productsError?.message);
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

  // Sync search state with URL when filters change
  useEffect(() => {
    if (filters.search !== search) {
      setSearch(filters.search || "");
    }
  }, [filters.search]);

  useEffect(() => {
    if (productsResponse) {
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
    handleOnChangeFilters: _handleOnChangeFilters,
    getCategoryNameFromId: _getCategoryNameFromId,
    onPageChange: _onPageChange,
  };
};

export default useProducts;
