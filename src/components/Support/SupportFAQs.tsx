import { ChevronDown, ChevronUp, HelpCircle, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { faqs } from "@/configs/constants";
import React, { useMemo, useState } from "react";

const SupportFAQs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const filteredFaqs = useMemo(
    () =>
      faqs?.filter(
        (faq: any) =>
          faq?.question?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
          faq?.answer?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      ),
    [searchQuery]
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search frequently asked questions..."
              className="pl-10 py-6"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFaqs?.map((faq: any) => (
          <Card key={faq.id}>
            <CardHeader
              className="cursor-pointer"
              onClick={() =>
                setExpandedFaq(expandedFaq === faq?.id ? null : faq?.id)
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{faq?.question}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {/* <Badge variant="outline">{faq?.category}</Badge> */}
                  {expandedFaq === faq?.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </div>
            </CardHeader>
            {expandedFaq === faq?.id && (
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{faq?.answer}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {filteredFaqs?.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No FAQs found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SupportFAQs;
