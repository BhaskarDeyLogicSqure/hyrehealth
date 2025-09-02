import { categoryApi } from "@/api/categories/categoryApi";
import { productApi } from "@/api/products/productApi";
import { profileApi } from "@/api/profile/profileApi";
import { getCurrentDomain } from "@/lib/utils";
import { headers } from "next/headers";

export const getHomePageData = async () => {
  try {
    // Get origin from headers
    const headersList = headers();
    const origin = getCurrentDomain(headersList);

    const [categoryResponse, productResponse, testimonialResponse] =
      await Promise.all([
        categoryApi.getFeaturedCategories(origin),
        productApi.getFeaturedProducts(origin),
        profileApi.getFeaturedTestimonials(origin),
      ]);

    return {
      featuredCategories: categoryResponse?.data,
      featuredProducts: productResponse?.data,
      featuredTestimonials: testimonialResponse?.testimonials,
    };
  } catch (error) {
    console.error(error);
    return {
      featuredCategories: [],
      featuredProducts: [],
      featuredTestimonials: [],
    };
  }
};
