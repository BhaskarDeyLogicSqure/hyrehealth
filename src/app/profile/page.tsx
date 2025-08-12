"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import ThemeLoader from "@/components/ThemeLoader";
import { extractQueryParams } from "@/lib/utils";

const SubscriptionTab = lazy(
  () => import("@/components/profile/SubscriptionTab")
);
const OrderHistoryTab = lazy(
  () => import("@/components/profile/OrderHistoryTab")
);
const PaymentManagementTab = lazy(
  () => import("@/components/profile/PaymentManagementTab")
);

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

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state?.authReducer?.user);
  const { tab: initialTab } = extractQueryParams();
  const router = useRouter();
  const pathname = usePathname();

  console.log({ user });

  const [activeTab, setActiveTab] = useState("subscriptions");
  // const [isHydrated, setIsHydrated] = useState(false);

  // Update URL when tab changes
  const _handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    router?.replace(`${pathname}?tab=${newTab}`);
  };

  // This is to prevent the hydration error
  // TODO: Remove this in future when implementing
  // useEffect(() => {
  //   setIsHydrated(true);
  // }, []);

  useEffect(() => {
    if (
      initialTab &&
      ["subscriptions", "orders", "payments"].includes(initialTab)
    ) {
      setActiveTab(initialTab);
    } else {
      // If no valid tab parameter, set default and update URL
      router?.replace(`${pathname}?tab=subscriptions`);
    }
  }, [initialTab, router, pathname]);

  const userName = user?.firstName || "";

  // if (!isHydrated) return null;

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Welcome, {userName}
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {tabConfig?.[activeTab as keyof typeof tabConfig]?.title}
        </h2>
        <p className="text-gray-600 text-lg">
          {tabConfig?.[activeTab as keyof typeof tabConfig]?.subtitle}
        </p>
      </div>

      <Tabs
        value={activeTab}
        className="w-full"
        onValueChange={_handleTabChange}
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

        <Suspense fallback={<ThemeLoader variant="full-page" />}>
          <TabsContent value="subscriptions" className="space-y-6 mt-8">
            <SubscriptionTab />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6 mt-8">
            <OrderHistoryTab customerId={user?.id || ""} />
          </TabsContent>

          <TabsContent value="payments" className="space-y-6 mt-8">
            <PaymentManagementTab />
          </TabsContent>
        </Suspense>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
