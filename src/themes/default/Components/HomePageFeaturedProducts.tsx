import React from "react";
import ProductsCard from "./ProductsCard";

const HomePageFeaturedProducts = ({
  featuredProducts,
}: {
  featuredProducts: any;
}) => {
  if (!featuredProducts?.length) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Featured Treatments
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredProducts?.map((product: any) => (
            <ProductsCard
              key={product?._id}
              product={product}
              isFeatured={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePageFeaturedProducts;
