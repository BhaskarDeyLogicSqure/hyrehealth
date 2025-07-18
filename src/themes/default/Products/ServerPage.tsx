import { dehydrate } from "@tanstack/react-query";
import ProductsPage from "./ClientPage";
import { getQueryClient } from "@/utils/getQueryClientUtil";
import { QueryHydrate } from "@/components/QueryHydrate";
import { productApi } from "@/api/products/productApi";

export default async function Page({ searchParams }: { searchParams: any }) {
  const queryClient = getQueryClient();

  //   const filters = {
  //     page: parseInt(searchParams?.page || "1", 10),
  //     limit: parseInt(searchParams?.limit || "10", 10),
  //   };

  await queryClient.prefetchQuery({
    queryKey: ["products", {}], // empty filter for initial
    queryFn: () => productApi.getProducts({}), // fetch initial products
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <QueryHydrate dehydratedState={dehydratedState}>
      <ProductsPage />
    </QueryHydrate>
  );
}
