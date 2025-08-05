"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import BasicInfoCard from "@/components/checkout/BasicInfoCard";
import BillingAddressCard from "@/components/checkout/BillingAddressCard";
import OrderSummarySection from "@/components/checkout/OrderSummarySection";
import PaymentInfoCard from "@/components/checkout/PaymentInfoCard";
import AccountCreationCard from "@/components/checkout/AccountCreationCard";
import useCheckoutDetails from "@/hooks/useCheckoutDetails";

const CheckoutPage = () => {
  const { isLoggedIn, formFields, errors, handleOnChange, handleGetPayload } =
    useCheckoutDetails();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">
            Complete your order to start your treatment
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            {!isLoggedIn ? (
              <BasicInfoCard
                formFields={formFields}
                errors={errors}
                handleInputChange={handleOnChange}
              />
            ) : null}

            {/* Billing Address */}
            <BillingAddressCard
              formFields={formFields}
              errors={errors}
              handleOnChange={handleOnChange}
            />

            {/* Payment Information */}
            <PaymentInfoCard
              formFields={formFields}
              errors={errors}
              handleOnChange={handleOnChange}
            />

            {/* Account Creation (if not logged in) */}
            {!isLoggedIn ? (
              <AccountCreationCard
                formFields={formFields}
                errors={errors}
                handleOnChange={handleOnChange}
              />
            ) : null}

            {/* Terms and Conditions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      className="h-5 w-5 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-colors"
                      id="acceptTerms"
                      checked={formFields?.acceptTerms}
                      onCheckedChange={(checked: boolean) =>
                        handleOnChange("acceptTerms", !!checked)
                      }
                    />
                    <Label
                      htmlFor="acceptTerms"
                      className="text-sm leading-relaxed text-gray-600 cursor-pointer"
                    >
                      I accept the Terms of Service, Privacy Policy, and HIPAA
                      Consent. I understand this medication requires a valid
                      prescription from a licensed physician.
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <OrderSummarySection handleGetPayload={handleGetPayload} />
        </div>

        {/* <br />
        <br />
        <br />
        <br />
        <QuestionnaireReview /> */}
      </div>
    </div>
  );
};

export default CheckoutPage;
