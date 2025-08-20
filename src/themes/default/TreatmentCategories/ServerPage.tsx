import { dehydrate } from "@tanstack/react-query";
import CategoriesPage from "./ClientPage";
import { categoryApi } from "@/api/categories/categoryApi";
import { getQueryClient } from "@/utils/getQueryClientUtil";
import { QueryHydrate } from "@/components/QueryHydrate";
import { headers } from "next/headers";
import { getCurrentDomain } from "@/lib/utils";

export default async function Page({ searchParams }: { searchParams: any }) {
  const queryClient = getQueryClient();

  // Extract filters from searchParams
  const filters = {
    // search: searchParams?.search || "",
    page: parseInt(searchParams?.page || "1", 10),
    limit: parseInt(searchParams?.limit || "6", 10),
  };

  const headersList = headers();
  const origin = getCurrentDomain(headersList);

  // Remove empty values to keep the query clean
  const cleanFilters = Object.fromEntries(
    // Object.entries(filters).filter(([_, value]) => value !== "" && value !== 0)
    Object.entries(filters).filter(([_, value]) => value !== 0)
  );

  // Prefetch categories with the filters from URL
  await queryClient.prefetchQuery({
    queryKey: ["Categories", cleanFilters], // Use the same key format as useCategoryApi
    queryFn: () => categoryApi.getCategories(cleanFilters, origin),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <QueryHydrate dehydratedState={dehydratedState}>
      <CategoriesPage />
    </QueryHydrate>
  );
}
