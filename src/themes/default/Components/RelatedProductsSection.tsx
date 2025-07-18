import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";
import { DEFAULT_IMAGE_URL } from "@/configs";
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
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold theme-text-primary mb-6">
          You Might Also Benefit From
        </h2>

        <div className="space-y-4">
          {product?.similarProducts?.map((relatedProduct) => (
            <div
              key={relatedProduct?._id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
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
                <div>
                  <h3 className="font-semibold theme-text-primary">
                    {relatedProduct?.name || "N/A"}
                  </h3>
                  <p className="text-sm theme-text-muted">
                    {relatedProduct?.contentAndDescription?.shortDescription ||
                      "N/A"}
                  </p>
                  <p className="text-sm font-semibold text-blue-600">
                    ${relatedProduct?.pricing?.basePrice || "N/A"}/month
                  </p>
                  {relatedProduct?.requiresConsultation && (
                    <p className="text-xs text-orange-600">
                      Additional consultation required
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* <Checkbox
                checked={selectedRelatedProducts?.includes(
                  relatedProduct?._id
                )}
                onCheckedChange={() =>
                  handleRelatedProductToggle(relatedProduct?._id)
                }
              /> */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleRelatedProductToggle(relatedProduct?._id)
                  }
                >
                  {selectedRelatedProducts?.includes(relatedProduct?._id) ? (
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatedProductsSection;
