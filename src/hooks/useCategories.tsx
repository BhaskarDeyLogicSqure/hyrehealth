import useCategoryApi from "@/api/categories/useCategoryApi";
import { useEffect, useState } from "react";
import { useCategoriesUrlParams } from "./useUrlParams";

const useCategories = () => {
  // Use URL params hook for state management
  const { params: dataPayload, setPage } = useCategoriesUrlParams();

  const [categories, setCategories] = useState<Record<string, any>>({
    data: [],
    total: 0,
  });

  const {
    categories: categoriesResponse,
    total: totalResponse,
    isCategoriesLoading,
    isCategoriesError,
    refetchCategories,
  } = useCategoryApi(dataPayload);

  const _onPageChange = (page: number) => {
    setPage(page);
  };

  useEffect(() => {
    if (categoriesResponse) {
      setCategories({
        data: categoriesResponse,
        total: totalResponse,
      });
    }
  }, [categoriesResponse]);

  return {
    categories,
    dataPayload,
    isCategoriesLoading,
    isCategoriesError,
    onPageChange: _onPageChange,
    refetch: refetchCategories,
  };
};

export default useCategories;
