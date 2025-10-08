"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import ProductsCard from "./ProductsCard";
import { useRouter } from "next/navigation";

const HomeFeaturedTreatments = ({
  featuredProducts,
}: {
  featuredProducts: any;
}) => {
  if (!featuredProducts?.length) return null;
  const router = useRouter();

  return (
    <>
      <section className="px-6 py-16 lg:px-8 bg-[#dbd9d633]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-bold text-gray-900 mb-4 text-3xl">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Our most popular physician-prescribed treatments, trusted by
              thousands of patients nationwide.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts?.map((product: any) => (
              <ProductsCard
                key={product?._id}
                product={product}
                isFeatured={true}
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button
              variant="outline"
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-normal text-sm h-8 px-4 rounded-md"
              onClick={() => {
                router.push("/products");
              }}
            >
              View All Treatments
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeFeaturedTreatments;
