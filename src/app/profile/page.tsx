"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  Calendar as CalendarIcon,
  Pause,
  X,
  AlertTriangle,
  CheckCircle,
  Receipt,
  Truck,
  RotateCcw,
  Eye,
  CreditCard,
  Plus,
  Trash2,
  Star,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { formatDate } from "@/lib/dayjs";
import { DIGITS_AFTER_DECIMALS } from "@/configs";

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state?.authReducer?.user);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [activeTab, setActiveTab] = useState("subscriptions");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const initialTab = searchParams.get("tab");
    if (
      initialTab &&
      ["subscriptions", "orders", "payments"].includes(initialTab)
    ) {
      setActiveTab(initialTab);
    } else {
      // If no valid tab parameter, set default and update URL
      router.replace(`${pathname}?tab=subscriptions`);
    }
  }, [searchParams, router, pathname]);

  // Update URL when tab changes
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    router.replace(`${pathname}?tab=${newTab}`);
  };

  // Tab content configuration
  const tabConfig = {
    subscriptions: {
      title: "My Subscriptions",
      subtitle: "Manage your active treatments and upcoming deliveries",
    },
    orders: {
      title: "Order History",
      subtitle: "View and manage your previous orders",
    },
    payments: {
      title: "Payment Methods",
      subtitle: "Manage your saved payment methods",
    },
  };

  // Mock subscription data
  const subscriptions = [
    {
      id: 1,
      productName: "Semaglutide",
      dosage: "0.25mg",
      status: "active",
      price: 299,
      nextBilling: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      nextShipment: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      consultationExpiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      shipmentHistory: [
        {
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          status: "delivered",
        },
        {
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          status: "delivered",
        },
      ],
    },
    {
      id: 2,
      productName: "BPC-157",
      dosage: "5mg",
      status: "active",
      price: 199,
      nextBilling: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      nextShipment: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      consultationExpiry: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      shipmentHistory: [
        {
          date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          status: "delivered",
        },
      ],
    },
    {
      id: 3,
      productName: "NAD+ Therapy",
      dosage: "100mg",
      status: "reconsult_needed",
      price: 349,
      nextBilling: null,
      nextShipment: null,
      consultationExpiry: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      shipmentHistory: [
        {
          date: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000),
          status: "delivered",
        },
        {
          date: new Date(Date.now() - 125 * 24 * 60 * 60 * 1000),
          status: "delivered",
        },
      ],
    },
  ];

  // Mock order data
  const orders = [
    {
      id: "ORD-2024-001",
      date: new Date("2024-01-15"),
      productName: "Semaglutide",
      dosage: "0.25mg",
      total: 299.0,
      status: "delivered",
      trackingNumber: "1Z999AA1234567890",
      canReorder: true,
      image: "https://placehold.co/600x400",
    },
    {
      id: "ORD-2024-002",
      date: new Date("2024-02-18"),
      productName: "BPC-157",
      dosage: "5mg",
      total: 199.0,
      status: "in_progress",
      trackingNumber: "1Z999BB1234567891",
      canReorder: true,
      image: "https://placehold.co/600x400",
    },
    {
      id: "ORD-2023-089",
      date: new Date("2023-12-10"),
      productName: "NAD+ Therapy",
      dosage: "100mg",
      total: 349.0,
      status: "refunded",
      trackingNumber: null,
      canReorder: false,
      image: "https://placehold.co/600x400",
    },
  ];

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

  // Helper functions
  const getSubscriptionStatusBadge = (
    status: string,
    consultationExpiry: Date
  ) => {
    const now = new Date();
    const isExpiringSoon =
      consultationExpiry.getTime() - now.getTime() < 14 * 24 * 60 * 60 * 1000;

    if (status === "reconsult_needed") {
      return <Badge variant="destructive">Reconsult Required</Badge>;
    }
    if (isExpiringSoon && status === "active") {
      return (
        <Badge className="bg-orange-100 text-orange-800">
          Consultation Expires Soon
        </Badge>
      );
    }
    if (status === "active") {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    }
    if (status === "paused") {
      return <Badge variant="secondary">Paused</Badge>;
    }
    return <Badge variant="secondary">{status}</Badge>;
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "refunded":
        return <Badge className="bg-red-100 text-red-800">Refunded</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCardIcon = (type: string) => {
    return <CreditCard className="h-6 w-6" />;
  };

  const handleAddCard = () => {
    const newMethod = {
      id: Date.now(),
      type: "visa",
      last4: newCard.number.slice(-4),
      expiry: newCard.expiry,
      isDefault: false,
      name: newCard.name,
    };
    setPaymentMethods([...paymentMethods, newMethod]);
    setNewCard({ number: "", expiry: "", cvc: "", name: "" });
  };

  const handleSetDefault = (id: number) => {
    setPaymentMethods((methods) =>
      methods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleDeleteCard = (id: number) => {
    setPaymentMethods((methods) =>
      methods.filter((method) => method.id !== id)
    );
  };

  // Modal components
  const SkipShipmentModal = ({ subscription }: { subscription: any }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Skip Next
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Skip Next Shipment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">
            You're about to skip your next shipment of{" "}
            {subscription.productName}. Your billing date will be pushed back by
            one month.
          </p>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> You can only skip up to 2 consecutive
              shipments before requiring a new consultation.
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-brand-dark-blue hover:bg-brand-dark-blue/90">
              Confirm Skip
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const PauseSubscriptionModal = ({ subscription }: { subscription: any }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-orange-600">
          <Pause className="h-4 w-4 mr-1" />
          Pause
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pause Subscription</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">
            How long would you like to pause your {subscription.productName}{" "}
            subscription?
          </p>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select pause duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 month</SelectItem>
              <SelectItem value="2">2 months</SelectItem>
              <SelectItem value="3">3 months</SelectItem>
            </SelectContent>
          </Select>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Important:</strong> Pausing for more than 3 months will
              require a new consultation to resume.
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-orange-600 hover:bg-orange-700">
              Pause Subscription
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // This is to prevent the hydration error
  // TODO: Remove this in future when implementing
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const userName = user?.firstName || "";

  if (!isHydrated) return null;

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome, {userName}
        </h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {tabConfig?.[activeTab as keyof typeof tabConfig]?.title}
        </h2>
        <p className="text-gray-600">
          {tabConfig?.[activeTab as keyof typeof tabConfig]?.subtitle}
        </p>
      </div>

      <Tabs
        value={activeTab}
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList className="grid w-full grid-cols-3 p-1 h-12">
          <TabsTrigger value="subscriptions" className="py-3 px-6">
            My Subscriptions
          </TabsTrigger>
          <TabsTrigger value="orders" className="py-3 px-6">
            Order History
          </TabsTrigger>
          <TabsTrigger value="payments" className="py-3 px-6">
            Payment Methods
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="space-y-6 mt-8">
          <div className="space-y-6">
            {subscriptions.map((subscription) => (
              <Card key={subscription.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        {subscription.productName}
                        <Badge variant="outline">{subscription.dosage}</Badge>
                      </CardTitle>
                      <p className="text-gray-600 text-sm mt-1">
                        ${subscription.price}/month
                      </p>
                    </div>
                    {getSubscriptionStatusBadge(
                      subscription.status,
                      subscription.consultationExpiry
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Status-specific alerts */}
                  {subscription.status === "reconsult_needed" && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
                        <div>
                          <h4 className="font-semibold text-red-800">
                            Consultation Required
                          </h4>
                          <p className="text-red-700 text-sm mt-1">
                            Your consultation expired on{" "}
                            {formatDate(subscription?.consultationExpiry)}.
                            Complete a new consultation to resume your
                            subscription.
                          </p>
                          <Button
                            size="sm"
                            className="mt-3 bg-red-600 hover:bg-red-700"
                          >
                            Schedule Consultation
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {subscription.status === "active" &&
                    subscription.consultationExpiry.getTime() - Date.now() <
                      14 * 24 * 60 * 60 * 1000 && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 mr-3" />
                          <div>
                            <h4 className="font-semibold text-orange-800">
                              Consultation Expires Soon
                            </h4>
                            <p className="text-orange-700 text-sm mt-1">
                              Your consultation expires on{" "}
                              {formatDate(subscription?.consultationExpiry)}.
                              Schedule a renewal to avoid interruption.
                            </p>
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-3 border-orange-300 text-orange-700"
                            >
                              Renew Consultation
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Subscription Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Upcoming
                      </h4>
                      {subscription.nextShipment ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Next shipment:
                            </span>
                            <span className="font-medium">
                              {formatDate(subscription.nextShipment)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Next billing:</span>
                            <span className="font-medium">
                              {formatDate(subscription?.nextBilling)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Consultation valid until:
                            </span>
                            <span className="font-medium">
                              {formatDate(subscription?.consultationExpiry)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          Subscription paused
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Recent Shipments</h4>
                      <div className="space-y-2">
                        {subscription.shipmentHistory
                          .slice(0, 3)
                          .map((shipment, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center text-sm"
                            >
                              <span className="text-gray-600">
                                {formatDate(shipment?.date)}
                              </span>
                              <div className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                                <span className="text-green-600 capitalize">
                                  {shipment.status}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {subscription.status === "active" && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      <SkipShipmentModal subscription={subscription} />
                      <PauseSubscriptionModal subscription={subscription} />
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add New Subscription */}
          <Card className="mt-8 border-dashed">
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Add Another Treatment
              </h3>
              <p className="text-gray-600 mb-4">
                Explore our comprehensive range of personalized treatments
              </p>
              <Button
                onClick={() => (window.location.href = "/products")}
                className="bg-brand-dark-blue hover:bg-brand-dark-blue/90"
              >
                Browse Treatments
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6 mt-8">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Your Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={order.image}
                              alt={order.productName}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <div>
                              <div className="font-medium">
                                {order.productName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.dosage}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(order?.date)}</TableCell>
                        <TableCell>
                          ${order.total.toFixed(DIGITS_AFTER_DECIMALS)}
                        </TableCell>
                        <TableCell>
                          {getOrderStatusBadge(order.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Receipt className="h-4 w-4 mr-1" />
                              Invoice
                            </Button>
                            {order?.trackingNumber && (
                              <Button variant="outline" size="sm">
                                <Truck className="h-4 w-4 mr-1" />
                                Track
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{order.id}</CardTitle>
                      <p className="text-sm text-gray-600">
                        {formatDate(order?.date)}
                      </p>
                    </div>
                    {getOrderStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={order.image}
                      alt={order.productName}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <div className="font-medium">{order.productName}</div>
                      <div className="text-sm text-gray-500">
                        {order.dosage}
                      </div>
                      <div className="text-lg font-semibold">
                        ${order.total.toFixed(DIGITS_AFTER_DECIMALS)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Receipt className="h-4 w-4 mr-1" />
                      Invoice
                    </Button>
                    {order.trackingNumber && (
                      <Button variant="outline" size="sm">
                        <Truck className="h-4 w-4 mr-1" />
                        Track
                      </Button>
                    )}
                    {order.canReorder && (
                      <Button variant="outline" size="sm">
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Reorder
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {orders.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Orders Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start your health journey with our personalized treatments
                </p>
                <Button onClick={() => (window.location.href = "/products")}>
                  Browse Treatments
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="payments" className="space-y-6 mt-8">
          {/* Saved Cards */}
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <Card key={method.id} className="relative">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getCardIcon(method.type)}
                      <div>
                        <div className="font-medium">
                          •••• •••• •••• {method.last4}
                        </div>
                        <div className="text-sm text-gray-500">
                          {method.name} • Expires {method.expiry}
                        </div>
                      </div>
                      {method.isDefault && (
                        <Badge className="bg-blue-100 text-blue-800">
                          <Star className="h-3 w-3 mr-1" />
                          Default
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {!method.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(method.id)}
                        >
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCard(method.id)}
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
                        value={newCard.name}
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
                        value={newCard.number}
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
                          value={newCard.expiry}
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
                          value={newCard.cvc}
                          onChange={(e) =>
                            setNewCard({ ...newCard, cvc: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline">Cancel</Button>
                      <Button
                        onClick={handleAddCard}
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
                    Your payment information is encrypted and securely stored.
                    We use industry-standard security measures to protect your
                    financial data and never store your full card details.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
