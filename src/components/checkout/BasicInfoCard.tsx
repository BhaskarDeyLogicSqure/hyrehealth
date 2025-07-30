import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import RenderFormError from "../RenderFormError";

const BasicInfoCard = ({
  formFields,
  errors,
  handleInputChange,
}: {
  formFields: any;
  errors: any;
  handleInputChange: (field: string, value: string) => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">
              First Name <span className="text-red-600">*</span>
            </Label>
            <Input
              id="firstName"
              value={formFields?.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              required
              className={errors?.firstName ? "border-red-500" : ""}
            />
            <RenderFormError errors={errors} field="firstName" />
          </div>

          <div>
            <Label htmlFor="lastName">
              Last Name <span className="text-red-600">*</span>
            </Label>
            <Input
              id="lastName"
              value={formFields?.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              required
              className={errors?.lastName ? "border-red-500" : ""}
            />
            <RenderFormError errors={errors} field="lastName" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">
              Email Address <span className="text-red-600">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formFields?.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              className={errors?.email ? "border-red-500" : ""}
            />
            <RenderFormError errors={errors} field="email" />
          </div>

          <div>
            <Label htmlFor="phone">
              Phone Number <span className="text-red-600">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formFields?.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
              className={errors?.phone ? "border-red-500" : ""}
            />
            <RenderFormError errors={errors} field="phone" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dob">
              Date of Birth <span className="text-red-600">*</span>
            </Label>
            <Input
              id="dob"
              type="date"
              value={formFields?.dob}
              onChange={(e) => handleInputChange("dob", e.target.value)}
              required
              className={errors?.dob ? "border-red-500" : ""}
            />
            <RenderFormError errors={errors} field="dob" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoCard;
