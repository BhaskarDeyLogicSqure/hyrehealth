import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";
import { DEFAULT_IMAGE_URL, DIGITS_AFTER_DECIMALS } from "@/configs";
import { Product } from "@/types/products";

const RelatedProductsSection = ({
  product,
  selectedRelatedProducts,
  handleRelatedProductToggle,
}: {
  product: Product;
  selectedRelatedProducts: string[];
  handleRelatedProductToggle: (productId: string) => void;
}) => {
  // Function to get default pricing for a related product
  const getDefaultPricing = (relatedProduct: any) => {
    if (!relatedProduct?.pricing?.subscriptionOptions) {
      return {
        dosage: "N/A",
        duration: "N/A",
        price: relatedProduct?.pricing?.basePrice || 0,
      };
    }

    // Find the default dosage option
    const defaultDosageOption =
      relatedProduct?.pricing?.subscriptionOptions?.find(
        (option: any) => option?.isDefault === true
      );

    // fallback to first option if no default dosage option is found
    if (!defaultDosageOption) {
      const firstOption = relatedProduct?.pricing?.subscriptionOptions?.[0];
      return {
        dosage: firstOption ? `${firstOption?.strength}mg` : "N/A",
        duration: firstOption
          ? `${firstOption?.duration?.value} ${
              firstOption?.duration?.unit || "month"
            }`
          : "N/A",
        price: firstOption?.price || relatedProduct?.pricing?.basePrice || 0,
      };
    }

    // Find default duration for the selected dosage
    const defaultDurationOption =
      relatedProduct?.pricing?.subscriptionOptions?.find(
        (option: any) =>
          option?.strength === defaultDosageOption?.strength &&
          option?.isDefault === true
      );

    return {
      dosage: `${defaultDosageOption.strength}mg`,
      duration: `${
        defaultDurationOption?.duration?.value ||
        defaultDosageOption?.duration?.value ||
        1
      } ${
        defaultDurationOption?.duration?.unit ||
        defaultDosageOption?.duration?.unit ||
        "month"
      }`,
      price:
        defaultDurationOption?.price ||
        defaultDosageOption?.price ||
        relatedProduct?.pricing?.basePrice ||
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
            const defaultPricing = getDefaultPricing(relatedProduct);

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
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold theme-text-primary">
                        {relatedProduct?.name || "N/A"}
                      </h3>
                      <p className="text-sm theme-text-muted">
                        {relatedProduct?.contentAndDescription
                          ?.shortDescription || "N/A"}
                      </p>

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

                      {relatedProduct?.requiresConsultation && (
                        <p className="text-xs text-orange-600 mt-1">
                          Additional consultation required
                        </p>
                      )}
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
