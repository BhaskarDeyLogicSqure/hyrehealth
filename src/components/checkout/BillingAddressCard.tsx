import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import RenderFormError from "../RenderFormError";
import { statesConfig } from "@/configs/constants";
import { preventNonNumericInput } from "@/lib/utils";

const BillingAddressCard = ({
  formFields,
  errors,
  handleOnChange,
}: {
  formFields: any;
  errors: any;
  handleOnChange: (field: string, value: string) => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Billing Address <span className="text-red-600">*</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="streetAddress">
              Street Address <span className="text-red-600">*</span>
            </Label>
            <Input
              id="streetAddress"
              value={formFields?.streetAddress}
              onChange={(e) => handleOnChange("streetAddress", e.target.value)}
              className={errors?.streetAddress ? "border-red-500" : ""}
            />
            <RenderFormError errors={errors} field="streetAddress" />
          </div>

          <div>
            <Label htmlFor="addressLine2">Address Line 2</Label>
            <Input
              id="addressLine2"
              value={formFields?.addressLine2}
              onChange={(e) => handleOnChange("addressLine2", e.target.value)}
              className={errors?.addressLine2 ? "border-red-500" : ""}
            />
            <RenderFormError errors={errors} field="addressLine2" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">
              City <span className="text-red-600">*</span>
            </Label>
            <Input
              id="city"
              value={formFields?.city}
              onChange={(e) => handleOnChange("city", e.target.value)}
              className={errors?.city ? "border-red-500" : ""}
            />
            <RenderFormError errors={errors} field="city" />
          </div>

          <div>
            <Label htmlFor="state">
              State <span className="text-red-600">*</span>
            </Label>
            <Select
              value={formFields?.state}
              onValueChange={(value) => handleOnChange("state", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className={errors?.state ? "border-red-500" : ""}>
                {statesConfig?.map((state) => (
                  <SelectItem
                    key={state?.abbreviation}
                    value={state?.abbreviation}
                  >
                    {state?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <RenderFormError errors={errors} field="state" />
          </div>

          <div>
            <Label htmlFor="zipCode">
              Zip Code <span className="text-red-600">*</span>
            </Label>
            <Input
              id="zipCode"
              value={formFields?.zipCode}
              onChange={(e) => handleOnChange("zipCode", e.target.value)}
              className={errors?.zipCode ? "border-red-500" : ""}
              onKeyDown={preventNonNumericInput}
            />
            <RenderFormError errors={errors} field="zipCode" />
          </div>
        </div>

        {/* <div>
          <Label htmlFor="country">
            Country <span className="text-red-600">*</span>
          </Label>
          <Select
            value={formFields?.country}
            onValueChange={(value) => handleOnChange("country", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={errors?.country ? "border-red-500" : ""}>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="CA">Canada</SelectItem>
            </SelectContent>
          </Select>
          <RenderFormError errors={errors} field="country" />
        </div> */}
      </CardContent>
    </Card>
  );
};

export default BillingAddressCard;
