import { categoryApi } from "@/api/categories/categoryApi";
import { productApi } from "@/api/products/productApi";
import { profileApi } from "@/api/profile/profileApi";
import { authApi } from "@/api/auth/authApi";
import { getCurrentDomain } from "@/lib/utils";
import { headers } from "next/headers";

export const getHomePageData = async () => {
  try {
    // Get origin from headers
    const headersList = headers();
    const origin = getCurrentDomain(headersList);

    // Fetch merchant data server-side
    const merchantResponse = await authApi.getMerchantNMITokenizationKey(
      origin
    );
    const merchantData = merchantResponse?.data;

    const fdaApproved = merchantData?.isApplyLegitScript || undefined; // undefined means both fda approved and non fda approved products will be shown

    const [categoryResponse, productResponse, testimonialResponse] =
      await Promise.all([
        categoryApi.getFeaturedCategories(origin),
        productApi.getFeaturedProducts(fdaApproved, origin),
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
