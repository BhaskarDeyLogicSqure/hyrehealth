import { categoryApi } from "@/api/categories/categoryApi";
import { productApi } from "@/api/products/productApi";

export const getHomePageData = async () => {
  try {
    const [categoryResponse, productResponse] = await Promise.all([
      categoryApi.getFeaturedCategories(),
      productApi.getFeaturedProducts(),
    ]);

    return {
      featuredCategories: categoryResponse?.data,
      featuredProducts: productResponse?.data,
    };
  } catch (error) {
    console.error(error);
    return {
      featuredCategories: [],
    };
  }
};
