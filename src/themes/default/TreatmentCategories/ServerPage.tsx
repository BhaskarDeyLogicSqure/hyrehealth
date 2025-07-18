import { dehydrate } from "@tanstack/react-query";
import CategoriesPage from "./ClientPage";
import { categoryApi } from "@/api/categories/categoryApi";
import { getQueryClient } from "@/utils/getQueryClientUtil";
import { QueryHydrate } from "@/components/QueryHydrate";

export default async function Page({ searchParams }: { searchParams: any }) {
  const queryClient = getQueryClient();

  //   const filters = {
  //     page: parseInt(searchParams?.page || "1", 10),
  //     limit: parseInt(searchParams?.limit || "10", 10),
  //   };

  await queryClient.prefetchQuery({
    queryKey: ["categories", {}], // empty filter for initial
    queryFn: () => categoryApi.getCategories({}), // fetch initial categories
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <QueryHydrate dehydratedState={dehydratedState}>
      <CategoriesPage />
    </QueryHydrate>
  );
}
