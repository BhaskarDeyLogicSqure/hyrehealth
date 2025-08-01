import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import RenderFormError from "../RenderFormError";
import { preventNonNumericInput } from "@/lib/utils";
import DatePicker from "../ui/DatePicker";

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
              className={errors?.firstName ? "border-red-500" : ""}
              placeholder="Enter your first name"
            />
            <RenderFormError errors={errors} field="firstName" />
          </div>

          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formFields?.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className={errors?.lastName ? "border-red-500" : ""}
              placeholder="Enter your last name"
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
              className={errors?.email ? "border-red-500" : ""}
              placeholder="Enter your email address"
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
              className={errors?.phone ? "border-red-500" : ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              onKeyDown={preventNonNumericInput}
              placeholder="Enter your phone number"
            />
            <RenderFormError errors={errors} field="phone" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <DatePicker
              label="Date of Birth"
              date={formFields?.dob ? new Date(formFields?.dob) : undefined}
              onDateChange={(date) => {
                if (date) {
                  handleInputChange("dob", date?.toISOString());
                } else {
                  handleInputChange("dob", "");
                }
              }}
              placeholder="Select your date of birth"
              required={true}
              error={!!errors?.dob}
              errorMessage={errors?.dob}
              maxDate={(() => {
                const today = new Date();
                return new Date(
                  today.getFullYear() - 18,
                  today.getMonth(),
                  today.getDate()
                );
              })()}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoCard;
