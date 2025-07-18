import { dehydrate } from "@tanstack/react-query";
import ProductsPage from "./ClientPage";
import { getQueryClient } from "@/utils/getQueryClientUtil";
import { QueryHydrate } from "@/components/QueryHydrate";
import { productApi } from "@/api/products/productApi";

export default async function Page({ searchParams }: { searchParams: any }) {
  const queryClient = getQueryClient();

  // Extract filters from searchParams
  const filters = {
    search: searchParams?.search || "",
    category: searchParams?.category || "",
    sort: searchParams?.sort || "",
    page: parseInt(searchParams?.page || "1", 10),
    limit: parseInt(searchParams?.limit || "6", 10),
  };

  // Remove empty values to keep the query clean
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== "" && value !== 0)
  );

  // Prefetch products with the filters from URL
  await queryClient.prefetchQuery({
    queryKey: ["Products", cleanFilters], // Use the same key format as useProductApi
    queryFn: () => productApi.getProducts(cleanFilters),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <QueryHydrate dehydratedState={dehydratedState}>
      <ProductsPage />
    </QueryHydrate>
  );
}
