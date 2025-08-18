import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tag, X, Ticket } from "lucide-react";
import ThemeLoader from "../ThemeLoader";

const CouponCodeSection = ({
  couponCode,
  isValidateCouponLoading,
  appliedCoupon,
  handleCouponCodeChange,
  handleApplyCoupon,
  handleClearCoupon,
}: {
  couponCode: string;
  isValidateCouponLoading: boolean;
  appliedCoupon: any;
  handleCouponCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleApplyCoupon: () => void;
  handleClearCoupon: () => void;
}) => {
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium">Coupon Code</span>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => handleCouponCodeChange(e)}
            className="flex-1"
            disabled={isValidateCouponLoading}
            onKeyDown={(e) => {
              console.log({ e });
              if (e.key === "Enter") {
                handleApplyCoupon();
              }
            }}
          />
          <Button
            variant="outline"
            onClick={handleApplyCoupon}
            className="px-4"
            disabled={isValidateCouponLoading}
          >
            {isValidateCouponLoading ? (
              <>
                Applying <ThemeLoader type="inline" variant="simple" />
              </>
            ) : (
              "Apply"
            )}
          </Button>
        </div>
        {appliedCoupon?.code && (
          <div className="mt-3 flex items-center gap-2">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium border border-green-200">
              <Ticket className="h-3 w-3" />
              <span>{appliedCoupon?.code}</span>
              <button
                onClick={handleClearCoupon}
                className="ml-1 hover:bg-white rounded-full p-0.5 transition-colors"
                title="Remove coupon"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CouponCodeSection;
