
import React from 'react'
import ThemeLoader from "@/components/ThemeLoader";

interface ProductsTitleProps {
  isLoading?: boolean;
}

const ProductsTitle: React.FC<ProductsTitleProps> = ({ isLoading = false }) => {
  return (
    <div className="mb-8 container mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold text-black mb-2 flex items-center">
        All Treatments{" "}
        {isLoading ? (
          <span className="ml-2">
            <ThemeLoader
              type="inline"
              variant="simple"
              size="sm"
              showIcon={true}
              className="ml-2"
            />
          </span>
        ) : null}
      </h1>
      <p className="theme-text-muted">
        Explore our comprehensive range of wellness treatments
      </p>
    </div>
  )
}

export default ProductsTitle