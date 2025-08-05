import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { CreditCard, Plus, Trash2, Star } from "lucide-react";

const PaymentManagementTab = () => {
  // Mock payment methods
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "visa",
      last4: "4242",
      expiry: "12/26",
      isDefault: true,
      name: "John Doe",
    },
    {
      id: 2,
      type: "mastercard",
      last4: "8888",
      expiry: "09/25",
      isDefault: false,
      name: "John Doe",
    },
  ]);

  const [newCard, setNewCard] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  const _getCardIcon = (type: string) => {
    return <CreditCard className="h-6 w-6" />;
  };

  const _handleAddCard = () => {
    const newMethod = {
      id: Date.now(),
      type: "visa",
      last4: newCard?.number?.slice(-4),
      expiry: newCard?.expiry,
      isDefault: false,
      name: newCard?.name,
    };
    setPaymentMethods([...paymentMethods, newMethod]);
    setNewCard({ number: "", expiry: "", cvc: "", name: "" });
  };

  const _handleSetDefault = (id: number) => {
    setPaymentMethods((methods) =>
      methods?.map((method) => ({
        ...method,
        isDefault: method?.id === id,
      }))
    );
  };

  const _handleDeleteCard = (id: number) => {
    setPaymentMethods((methods) =>
      methods?.filter((method) => method?.id !== id)
    );
  };

  return (
    <>
      {/* Saved Cards */}
      <div className="space-y-4">
        {paymentMethods?.map((method) => (
          <Card key={method?.id} className="relative">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {_getCardIcon(method?.type)}
                  <div>
                    <div className="font-medium">
                      •••• •••• •••• {method?.last4}
                    </div>
                    <div className="text-sm text-gray-500">
                      {method?.name} • Expires {method?.expiry}
                    </div>
                  </div>
                  {method?.isDefault && (
                    <Badge className="bg-blue-100 text-blue-800">
                      <Star className="h-3 w-3 mr-1" />
                      Default
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  {!method?.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => _handleSetDefault(method?.id)}
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => _handleDeleteCard(method?.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Card */}
      <Card className="border-dashed">
        <CardContent className="text-center py-12">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Add New Payment Method
          </h3>
          <p className="text-gray-600 mb-4">
            Securely save a new card for faster checkout
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-brand-dark-blue hover:bg-brand-dark-blue/90">
                <Plus className="h-4 w-4 mr-2" />
                Add New Card
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Payment Method</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={newCard?.name}
                    onChange={(e) =>
                      setNewCard({ ...newCard, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={newCard?.number}
                    onChange={(e) =>
                      setNewCard({ ...newCard, number: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={newCard?.expiry}
                      onChange={(e) =>
                        setNewCard({ ...newCard, expiry: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      value={newCard?.cvc}
                      onChange={(e) =>
                        setNewCard({ ...newCard, cvc: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline">Cancel</Button>
                  <Button
                    onClick={_handleAddCard}
                    className="bg-brand-dark-blue hover:bg-brand-dark-blue/90"
                  >
                    Add Card
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="bg-brand-light-blue/20 border-brand-light-blue">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-brand-dark-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
              <CreditCard className="h-4 w-4 text-brand-dark-blue" />
            </div>
            <div>
              <h4 className="font-semibold text-brand-dark-blue">
                Secure Payment Processing
              </h4>
              <p className="text-brand-dark-blue/80 text-sm mt-1">
                Your payment information is encrypted and securely stored. We
                use industry-standard security measures to protect your
                financial data and never store your full card details.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default PaymentManagementTab;
