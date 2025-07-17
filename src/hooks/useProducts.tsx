import { Category } from "@/types/categories";
import { useEffect, useRef, useState, useCallback } from "react";
import useProductApi from "@/api/products/useProductApi";
import useCategoryApi from "@/api/categories/useCategoryApi";
import { errorToast } from "@/utils/toasters";

const initialFilters = {
  search: "",
  category: "",
  sort: "",
  page: 1,
  limit: 6,
};

const useProducts = () => {
  const searchRef = useRef<NodeJS.Timeout | null>(null);

  // it is being used for react query api call, as whenever the user updates the filters, react query will make a new api call (as we have passed it as a dependency in query key)
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);
  const [search, setSearch] = useState<string>(""); // need a different state for search, as search is being debounced

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
    const newFilters = { ...filters };

    // doing this to reset the page and limit to 1 and 10 when the user changes the filters
    newFilters.page = 1;
    newFilters.limit = 6;

    // if the user is searching, we want to debounce the search
    if (key === "search") {
      setSearch(value);
      if (searchRef.current) clearTimeout(searchRef.current);

      searchRef.current = setTimeout(() => {
        setFilters((prev) => ({
          ...prev,
          [key]: value,
          page: 1,
          limit: 6,
        }));
      }, 500);
    } else {
      // if the user is not searching, we want to update the data payload and make api call immediately
      newFilters[key] = value;
      setFilters(newFilters);
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
    const newFilters = { ...filters };
    newFilters.page = page;
    setFilters(newFilters);
  };

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
