"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import QuestionnaireReview from "@/components/checkout/QuestionnaireReview";
import BasicInfoCard from "@/components/checkout/BasicInfoCard";
import BillingAddressCard from "@/components/checkout/BillingAddressCard";
import useCheckoutPayment from "@/hooks/useCheckoutPayment";
import OrderSummarySection from "@/components/checkout/OrderSummarySection";
import PaymentInfoCard from "@/components/checkout/PaymentInfoCard";
import AccountCreationCard from "@/components/checkout/AccountCreationCard";
const CheckoutPage = () => {
  const {
    formFields,
    errors,
    selectedDosagePrice,
    product,
    relatedProductsData,
    selectedRelatedProducts,
    totalPrice,
    consultationFee,
    duration,
    handleSubmit,
    handleOnChange,
    handleRemoveRelatedProduct,
  } = useCheckoutPayment();

  const isLoggedIn = false; // TODO: change this to actual implementation from redux store

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">
            Complete your order to start your treatment
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <BasicInfoCard
                formFields={formFields}
                errors={errors}
                handleInputChange={handleOnChange}
              />

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
              {!isLoggedIn && (
                <AccountCreationCard
                  formFields={formFields}
                  errors={errors}
                  handleOnChange={handleOnChange}
                />
              )}

              {/* Terms and Conditions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="acceptTerms"
                        checked={formFields?.acceptTerms}
                        onCheckedChange={(checked) =>
                          handleOnChange("acceptTerms", !!checked)
                        }
                      />
                      <Label
                        htmlFor="acceptTerms"
                        className="text-sm leading-relaxed"
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
            <OrderSummarySection
              product={product}
              duration={duration}
              selectedDosagePrice={selectedDosagePrice}
              selectedRelatedProducts={selectedRelatedProducts}
              relatedProductsData={relatedProductsData}
              totalPrice={totalPrice}
              consultationFee={consultationFee}
              formFields={formFields}
              handleRemoveRelatedProduct={handleRemoveRelatedProduct}
            />
          </div>
        </form>

        <QuestionnaireReview />
      </div>
    </div>
  );
};

export default CheckoutPage;
