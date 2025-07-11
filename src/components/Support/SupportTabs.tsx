"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SupportFAQs from "./SupportFAQs";
import SupportContactUsForm from "./SupportContactUsForm";

const SupportTabs = () => {
  const [tab, setTab] = useState("faq");

  return (
    <Tabs value={tab} className="space-y-6" onValueChange={setTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="faq">FAQ</TabsTrigger>
        <TabsTrigger value="contact">Contact Us</TabsTrigger>
      </TabsList>

      <TabsContent value="faq">
        <SupportFAQs />
      </TabsContent>

      <TabsContent value="contact">
        <SupportContactUsForm />
      </TabsContent>
    </Tabs>
  );
};

export default SupportTabs;
