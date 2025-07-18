import useCategoryApi from "@/api/categories/useCategoryApi";
import { useEffect, useState } from "react";

const useCategories = () => {
  const [dataPayload, setDataPayload] = useState<Record<string, any>>({
    page: 1,
    limit: 6,
  });

  const [categories, setCategories] = useState<Record<string, any>>({
    data: [],
    total: 0,
  });

  const {
    categories: categoriesResponse,
    total: totalResponse,
    isCategoriesLoading,
    isCategoriesError,
  } = useCategoryApi(dataPayload);

  const _onPageChange = (page: number) => {
    const newDataPayload = { ...dataPayload };
    newDataPayload.page = page;
    setDataPayload(newDataPayload);
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
  };
};

export default useCategories;
