import ProductSection from "../Components/ProductSection";
import { productApi } from "@/api/products/productApi";
import { handleServerError } from "@/lib/error-handler";
import { getCurrentDomain } from "@/lib/utils";
import { headers } from "next/headers";
// import { notFound } from "next/navigation";
interface ProductDetailsPageProps {
  params: {
    id: string;
  };
}

const DefaultProductDetailsPage = async ({
  params,
}: ProductDetailsPageProps) => {
  let product;

  // get the origin from the headers
  const headersList = headers();
  const origin = getCurrentDomain(headersList);

  try {
    product = await productApi.getProductById(params?.id, origin);
  } catch (err: any) {
    // Use the global error handler
    handleServerError(err, {
      customMessage: "Failed to load product details",
      redirectTo: "/products",
      showToast: true,
      logError: true,
    });

    // return notFound();
  }

  return (
    <div className="min-h-screen theme-bg">
      <div className="container mx-auto px-4 py-8">
        <ProductSection product={product as any} />
      </div>
    </div>
  );
};

export default DefaultProductDetailsPage;
