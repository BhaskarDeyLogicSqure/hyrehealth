import { categoryApi } from "@/api/categories/categoryApi";
import { productApi } from "@/api/products/productApi";
import { getCurrentDomain } from "@/lib/utils";
import { headers } from "next/headers";

export const getHomePageData = async () => {
  try {
    // Get origin from headers
    const headersList = headers();
    const origin = getCurrentDomain(headersList);

    const [categoryResponse, productResponse] = await Promise.all([
      categoryApi.getFeaturedCategories(origin),
      productApi.getFeaturedProducts(origin),
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
