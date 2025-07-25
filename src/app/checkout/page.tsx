"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Shield, CreditCard, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QuestionnaireReview from "@/components/checkout/QuestionnaireReview";
const CheckoutPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const productId = searchParams.get("product");
  const dosage = searchParams.get("dosage");
  const duration = searchParams.get("duration") || "1";
  const relatedProductIds =
    searchParams.get("relatedProducts")?.split(",").filter(Boolean) || [];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [selectedRelatedProducts, setSelectedRelatedProducts] =
    useState<string[]>(relatedProductIds);
  const [isLoggedIn] = useState(false); // Mock login state

  // Mock product data
  const product = {
    name: "Semaglutide",
    dosages: [
      { value: "0.25mg", label: "0.25mg (Starting dose)", price: 299 },
      { value: "0.5mg", label: "0.5mg (Maintenance)", price: 349 },
      { value: "1.0mg", label: "1.0mg (Maximum)", price: 399 },
    ],
  };

  // Mock related products data
  const relatedProductsData = [
    { id: "2", name: "B12 Injection", price: 99 },
    { id: "3", name: "Tirzepatide", price: 399 },
  ];

  const selectedDosagePrice =
    product.dosages.find((d) => d.value === dosage)?.price || 299;
  const relatedProductsTotal = selectedRelatedProducts.reduce(
    (total, productId) => {
      const relatedProduct = relatedProductsData.find(
        (p) => p.id === productId
      );
      return total + (relatedProduct?.price || 0);
    },
    0
  );
  const totalPrice =
    (selectedDosagePrice + relatedProductsTotal) * parseInt(duration);
  const consultationFee = 49;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRemoveRelatedProduct = (productId: string) => {
    setSelectedRelatedProducts((prev) => prev.filter((id) => id !== productId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.acceptTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    if (!isLoggedIn && formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    // Mock successful checkout
    console.log("Checkout submitted:", formData);

    toast({
      title: "Order Placed Successfully",
      description: "Your order is being processed.",
    });

    // Navigate to thank you page
    const relatedProductsParam =
      selectedRelatedProducts.length > 0
        ? `&relatedProducts=${selectedRelatedProducts.join(",")}`
        : "";
    router.push(
      `/thank-you?total=${totalPrice + consultationFee}${relatedProductsParam}`
    );
  };

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
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="streetAddress">Street Address *</Label>
                    <Input
                      id="streetAddress"
                      value={formData.streetAddress}
                      onChange={(e) =>
                        handleInputChange("streetAddress", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Select
                        value={formData.state}
                        onValueChange={(value) =>
                          handleInputChange("state", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                          <SelectItem value="WA">Washington</SelectItem>
                          <SelectItem value="CO">Colorado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Zip Code *</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) =>
                          handleInputChange("zipCode", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) =>
                        handleInputChange("country", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) =>
                        handleInputChange("cardNumber", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) =>
                          handleInputChange("expiryDate", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) =>
                          handleInputChange("cvv", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardholderName">Cardholder Name *</Label>
                    <Input
                      id="cardholderName"
                      value={formData.cardholderName}
                      onChange={(e) =>
                        handleInputChange("cardholderName", e.target.value)
                      }
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Account Creation (if not logged in) */}
              {!isLoggedIn && (
                <Card>
                  <CardHeader>
                    <CardTitle>Create Your Account</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      An account will be created to manage your orders and
                      subscriptions
                    </p>
                    <div>
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">
                        Confirm Password *
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Terms and Conditions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="acceptTerms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) =>
                          handleInputChange("acceptTerms", !!checked)
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
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Main Product */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Dosage: {dosage}
                        </p>
                        <p className="text-sm text-gray-600">
                          Duration: {duration} month
                          {duration !== "1" ? "s" : ""}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ${selectedDosagePrice * parseInt(duration)}
                      </p>
                    </div>
                  </div>

                  {/* Related Products */}
                  {selectedRelatedProducts.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-700">
                        Additional Products:
                      </h4>
                      {selectedRelatedProducts.map((productId) => {
                        const relatedProduct = relatedProductsData.find(
                          (p) => p.id === productId
                        );
                        if (!relatedProduct) return null;

                        return (
                          <div
                            key={productId}
                            className="p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h5 className="font-medium text-gray-900">
                                  {relatedProduct.name}
                                </h5>
                                <p className="text-sm text-gray-600">
                                  {duration} month{duration !== "1" ? "s" : ""}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold">
                                  ${relatedProduct.price * parseInt(duration)}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleRemoveRelatedProduct(productId)
                                  }
                                  className="text-red-600 hover:text-red-800"
                                  type="button"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <Separator />

                  {/* Pricing Summary */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Treatment cost:</span>
                      <span>${totalPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Consultation fee:</span>
                      <span>${consultationFee}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span>${totalPrice + consultationFee}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-lg py-6"
                    disabled={!formData.acceptTerms}
                  >
                    Complete Purchase
                  </Button>

                  <div className="flex items-center justify-center text-sm text-gray-500 mt-4">
                    <Shield className="h-4 w-4 mr-2" />
                    Secure 256-bit SSL encryption
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>

        <QuestionnaireReview />
      </div>
    </div>
  );
};

export default CheckoutPage;
