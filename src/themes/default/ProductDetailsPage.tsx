"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Star,
  Clock,
  Shield,
  Truck,
  AlertCircle,
  CheckCircle,
  Plus,
  ArrowLeft,
} from "lucide-react";

interface ProductDetailsPageProps {
  params: {
    id: string;
  };
}

const DefaultProductDetailsPage = ({ params }: ProductDetailsPageProps) => {
  const router = useRouter();
  const [selectedDosage, setSelectedDosage] = useState("");
  const [subscriptionDuration, setSubscriptionDuration] = useState("1");
  const [selectedRelatedProducts, setSelectedRelatedProducts] = useState<
    string[]
  >([]);

  // Simulate consultation status check
  const [hasValidConsultation, setHasValidConsultation] = useState(false);

  // Mock product data - in real app this would be fetched based on params.id
  const product = {
    id: parseInt(params.id),
    name: "Semaglutide",
    category: "Weight Loss",
    description:
      "Semaglutide is a GLP-1 receptor agonist that helps regulate blood sugar levels and promotes weight loss by reducing appetite and slowing gastric emptying. This FDA-approved medication has shown remarkable results in clinical trials.",
    longDescription:
      "Our compounded semaglutide is prepared in state-of-the-art facilities following strict quality guidelines. Each dose is precisely measured to ensure consistent therapeutic effects while minimizing side effects.",
    basePrice: 299,
    rating: 4.8,
    reviews: 1247,
    dosages: [
      { value: "0.25mg", label: "0.25mg (Starting dose)", price: 299 },
      { value: "0.5mg", label: "0.5mg (Maintenance)", price: 349 },
      { value: "1.0mg", label: "1.0mg (Maximum)", price: 399 },
    ],
    benefits: [
      "Significant weight loss (10-15% body weight)",
      "Improved blood sugar control",
      "Reduced appetite and cravings",
      "Enhanced metabolic health",
      "Cardiovascular benefits",
    ],
    sideEffects: [
      "Nausea (usually mild and temporary)",
      "Diarrhea or constipation",
      "Fatigue",
      "Headache",
      "Dizziness",
    ],
    contraindications: [
      "History of medullary thyroid carcinoma",
      "Multiple Endocrine Neoplasia syndrome type 2",
      "Pregnancy or breastfeeding",
      "Severe gastrointestinal disease",
    ],
  };

  // Mock related products data
  const relatedProducts = [
    {
      id: 2,
      name: "B12 Injection",
      description: "Energy boost and metabolic support",
      price: 99,
      image: "💉",
      requiresConsultation: false,
    },
    {
      id: 3,
      name: "Tirzepatide",
      description: "Advanced dual-action weight loss treatment",
      price: 399,
      image: "💊",
      requiresConsultation: true,
    },
  ];

  useEffect(() => {
    // Check consultation status (mock implementation)
    const lastConsultation = localStorage.getItem("lastConsultation");
    if (lastConsultation) {
      const consultDate = new Date(lastConsultation);
      const expiryDate = new Date(
        consultDate.getTime() + 90 * 24 * 60 * 60 * 1000
      ); // 90 days
      const now = new Date();

      if (now < expiryDate) {
        setHasValidConsultation(true);
      }
    }
  }, []);

  const selectedDosagePrice =
    product.dosages.find((d) => d.value === selectedDosage)?.price ||
    product.basePrice;
  const relatedProductsTotal = selectedRelatedProducts.reduce(
    (total, productId) => {
      const relatedProduct = relatedProducts.find(
        (p) => p.id.toString() === productId
      );
      return total + (relatedProduct?.price || 0);
    },
    0
  );
  const totalPrice =
    (selectedDosagePrice + relatedProductsTotal) *
    parseInt(subscriptionDuration);

  const handleRelatedProductToggle = (productId: string) => {
    setSelectedRelatedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleProceedToCheckout = () => {
    if (!selectedDosage) {
      alert("Please select a dosage first");
      return;
    }

    // Build URL with selected products
    const relatedProductsParam =
      selectedRelatedProducts.length > 0
        ? `&relatedProducts=${selectedRelatedProducts.join(",")}`
        : "";

    router.push(
      `/eligibility-questionnaire/?productId=${params.id}&dosage=${selectedDosage}&duration=${subscriptionDuration}${relatedProductsParam}`
    );
  };

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="min-h-screen theme-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBackClick}
            className="inline-flex items-center gap-2 theme-text-primary hover:theme-bg-muted transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Products
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Product Image & Info */}
          <div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 mb-8 text-center">
              <div className="w-32 h-32 bg-white rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                <span className="text-4xl font-bold text-blue-600">
                  {product.name.charAt(0)}
                </span>
              </div>
              <Badge className="mb-4">{product.category}</Badge>
              <h1 className="text-3xl font-bold theme-text-primary mb-2">
                {product.name}
              </h1>
              <div className="flex items-center justify-center mb-4">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 font-semibold">{product.rating}</span>
                <span className="ml-1 theme-text-muted">
                  ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Product Description */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold theme-text-primary mb-4">
                  About This Treatment
                </h2>
                <p className="theme-text-muted mb-4">{product.description}</p>
                <p className="theme-text-muted text-sm">
                  {product.longDescription}
                </p>
              </CardContent>
            </Card>

            {/* Benefits & Side Effects */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-green-700 mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Benefits
                  </h3>
                  <ul className="space-y-2">
                    {product.benefits.map((benefit, index) => (
                      <li
                        key={index}
                        className="text-sm theme-text-muted flex items-start"
                      >
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-orange-700 mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Possible Side Effects
                  </h3>
                  <ul className="space-y-2">
                    {product.sideEffects.map((effect, index) => (
                      <li
                        key={index}
                        className="text-sm theme-text-muted flex items-start"
                      >
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {effect}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Related Products Section */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold theme-text-primary mb-6">
                  You Might Also Benefit From
                </h2>
                <div className="space-y-4">
                  {relatedProducts.map((relatedProduct) => (
                    <div
                      key={relatedProduct.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{relatedProduct.image}</div>
                        <div>
                          <h3 className="font-semibold theme-text-primary">
                            {relatedProduct.name}
                          </h3>
                          <p className="text-sm theme-text-muted">
                            {relatedProduct.description}
                          </p>
                          <p className="text-sm font-semibold text-blue-600">
                            ${relatedProduct.price}/month
                          </p>
                          {relatedProduct.requiresConsultation && (
                            <p className="text-xs text-orange-600">
                              Additional consultation required
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedRelatedProducts.includes(
                            relatedProduct.id.toString()
                          )}
                          onCheckedChange={() =>
                            handleRelatedProductToggle(
                              relatedProduct.id.toString()
                            )
                          }
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleRelatedProductToggle(
                              relatedProduct.id.toString()
                            )
                          }
                        >
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Purchase Options */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-8">
                {/* Consultation Status - only show if no valid consultation */}
                {!hasValidConsultation && (
                  <Alert className="mb-6 border-blue-200 bg-blue-50">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Consultation required before purchase</strong>
                      <br />
                      Complete our questionnaire and medical intake form to
                      proceed
                    </AlertDescription>
                  </Alert>
                )}

                {/* Dosage Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium theme-text-primary mb-2">
                    Select Dosage
                  </label>
                  <Select
                    value={selectedDosage}
                    onValueChange={setSelectedDosage}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your dosage" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.dosages.map((dosage) => (
                        <SelectItem key={dosage.value} value={dosage.value}>
                          {dosage.label} - ${dosage.price}/month
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subscription Duration */}
                <div className="mb-6">
                  <label className="block text-sm font-medium theme-text-primary mb-2">
                    Subscription Duration
                  </label>
                  <Select
                    value={subscriptionDuration}
                    onValueChange={setSubscriptionDuration}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Month</SelectItem>
                      <SelectItem value="2">2 Months (Save 5%)</SelectItem>
                      <SelectItem value="3">3 Months (Save 10%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="my-6" />

                {/* Pricing */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm theme-text-muted">
                    <span>Monthly price:</span>
                    <span>${selectedDosagePrice}</span>
                  </div>
                  {selectedRelatedProducts.length > 0 && (
                    <div className="flex justify-between text-sm theme-text-muted">
                      <span>Related products:</span>
                      <span>${relatedProductsTotal}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm theme-text-muted">
                    <span>Duration:</span>
                    <span>
                      {subscriptionDuration} month
                      {subscriptionDuration !== "1" ? "s" : ""}
                    </span>
                  </div>
                  {!hasValidConsultation && (
                    <div className="flex justify-between text-sm theme-text-muted">
                      <span>Consultation fee:</span>
                      <span>$49</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold theme-text-primary">
                    <span>Total:</span>
                    <span>${totalPrice + (hasValidConsultation ? 0 : 49)}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  className="w-full text-lg py-6"
                  onClick={handleProceedToCheckout}
                  disabled={!selectedDosage}
                >
                  Proceed to Checkout
                </Button>

                {/* Trust Indicators */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm theme-text-muted">
                    <Shield className="h-4 w-4 mr-2 text-green-600" />
                    FDA approved ingredients
                  </div>
                  <div className="flex items-center text-sm theme-text-muted">
                    <Truck className="h-4 w-4 mr-2 text-blue-600" />
                    Free shipping & discrete packaging
                  </div>
                  <div className="flex items-center text-sm theme-text-muted">
                    <Clock className="h-4 w-4 mr-2 text-purple-600" />
                    Licensed physician consultation
                  </div>
                </div>

                {/* Important Notice */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs theme-text-muted">
                    <strong>Important:</strong> This medication requires a valid
                    prescription. Our licensed physicians will review your
                    health information and determine if this treatment is
                    appropriate for you.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultProductDetailsPage;
