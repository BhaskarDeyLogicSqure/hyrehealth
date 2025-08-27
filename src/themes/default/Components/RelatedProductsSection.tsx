import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { DEFAULT_IMAGE_URL, DIGITS_AFTER_DECIMALS } from "@/configs";
import { Product } from "@/types/products";
import { useState } from "react";

const RelatedProductsSection = ({
  product,
  selectedRelatedProducts,
  handleRelatedProductToggle,
}: {
  product: Product;
  selectedRelatedProducts: string[];
  handleRelatedProductToggle: (productId: string) => void;
}) => {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const _handleImageError = (productId: string) => {
    setFailedImages((prev) => new Set(prev).add(productId));
  };

  const _isImageFailed = (productId: string) => {
    return failedImages.has(productId);
  };

  // Function to get default pricing for a related product
  const _getDefaultPricing = (relatedProduct: any) => {
    if (!relatedProduct?.pricing?.subscriptionOptions) {
      return {
        dosage: "N/A",
        duration: "N/A",
        price: relatedProduct?.pricing?.lowestPrice || 0,
      };
    }

    // Find the default dosage option, and with lowest duration
    const defaultDosageOption =
      relatedProduct?.pricing?.subscriptionOptions?.filter(
        (option: any) => option?.isDefault === true
      );

    const defaultDurationOptionWithLowestDuration =
      defaultDosageOption?.reduce((acc: any, option: any) => {
        return acc?.duration?.value < option?.duration?.value ? acc : option;
      }, defaultDosageOption?.[0]) || defaultDosageOption?.[0];

    // fallback to first option if no default dosage option with lowest duration is found
    if (!defaultDurationOptionWithLowestDuration) {
      const firstOption = relatedProduct?.pricing?.subscriptionOptions?.[0];
      return {
        dosage: firstOption ? `${firstOption?.strength}mg` : "N/A",
        duration: firstOption
          ? `${firstOption?.duration?.value} ${
              firstOption?.duration?.unit || "month"
            }`
          : "N/A",
        price: firstOption?.price || relatedProduct?.pricing?.lowestPrice || 0,
      };
    }

    return {
      dosage: `${defaultDurationOptionWithLowestDuration?.strength}mg`,
      duration: `${defaultDurationOptionWithLowestDuration?.duration?.value} ${
        defaultDurationOptionWithLowestDuration?.duration?.unit || "month"
      }`,
      price:
        defaultDurationOptionWithLowestDuration?.price ||
        relatedProduct?.pricing?.lowestPrice ||
        0,
    };
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold theme-text-primary mb-6">
          You Might Also Benefit From
        </h2>

        <div className="space-y-4">
          {product?.similarProducts?.map((relatedProduct) => {
            const isSelected = selectedRelatedProducts?.includes(
              relatedProduct?._id
            );
            const defaultPricing = _getDefaultPricing(relatedProduct);

            return (
              <div
                key={relatedProduct?._id}
                className={`p-4 border rounded-lg transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {relatedProduct?.media?.images?.[0]?.url &&
                      !_isImageFailed(relatedProduct?._id) ? (
                        <Image
                          src={
                            relatedProduct?.media?.images?.[0]?.url &&
                            !relatedProduct?.media?.images?.[0]?.url.includes(
                              "example"
                            )
                              ? relatedProduct?.media?.images?.[0]?.url
                              : DEFAULT_IMAGE_URL
                          }
                          alt={relatedProduct?.name || "N/A"}
                          width={36}
                          height={36}
                          onError={() => _handleImageError(relatedProduct?._id)}
                        />
                      ) : (
                        <div className="w-9 h-9 bg-gray-100 rounded flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold theme-text-primary">
                        {relatedProduct?.name || "N/A"}
                      </h3>
                      {relatedProduct?.contentAndDescription
                        ?.shortDescription ? (
                        <p className="text-sm theme-text-muted">
                          {relatedProduct?.contentAndDescription
                            ?.shortDescription || "N/A"}
                        </p>
                      ) : null}

                      {/* Default Selection Info */}
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center space-x-4 text-xs">
                          <span className="theme-text-muted">
                            Default: {defaultPricing?.dosage} •{" "}
                            {defaultPricing?.duration}
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-blue-600">
                          $
                          {defaultPricing?.price?.toFixed(
                            DIGITS_AFTER_DECIMALS
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleRelatedProductToggle(relatedProduct?._id)
                      }
                      className={
                        isSelected ? "border-blue-500 text-blue-600" : ""
                      }
                    >
                      {isSelected ? (
                        <>
                          <Minus className="h-4 w-4" />
                          Remove
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Add
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatedProductsSection;
