import ProductSection from "../Components/ProductSection";
import { productApi } from "@/api/products/productApi";
import { redirect } from "next/navigation";
interface ProductDetailsPageProps {
  params: {
    id: string;
  };
}

const DefaultProductDetailsPage = async ({
  params,
}: ProductDetailsPageProps) => {
  let product;
  try {
    product = await productApi.getProductById(params?.id);
    // console.log({ product });
  } catch (err: any) {
    console.log("Error fetching product: ", err);
    redirect(`/products`);
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
