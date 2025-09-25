import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Send, Phone } from "lucide-react";
import { showSuccessToast } from "@/components/GlobalErrorHandler";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const SupportContactUsForm = () => {
  const { merchantData } = useSelector(
    (state: RootState) => state?.merchantReducer
  );

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "",
  });

  const _handleContactSubmit = (e: React.FormEvent) => {
    if (e) e.preventDefault();
    showSuccessToast(
      "Your message has been sent! We'll get back to you within 24 hours."
    );

    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: "",
      category: "",
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-black" />
            Send us a message
          </CardTitle>
          <CardDescription>
            Can't find what you're looking for? Send us a message and we'll get
            back to you within 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={_handleContactSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={contactForm?.name}
                  placeholder="Enter your full name"
                  onChange={(e) =>
                    setContactForm({
                      ...contactForm,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={contactForm?.email}
                  onChange={(e) =>
                    setContactForm({
                      ...contactForm,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="subject">
                Subject <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subject"
                placeholder="Brief description of your inquiry"
                value={contactForm?.subject}
                onChange={(e) =>
                  setContactForm({
                    ...contactForm,
                    subject: e.target.value,
                  })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="message">
                Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                rows={6}
                value={contactForm?.message}
                placeholder="Please provide as much detail as possible"
                onChange={(e) =>
                  setContactForm({
                    ...contactForm,
                    message: e.target.value,
                  })
                }
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              style={{
                backgroundColor: merchantData?.customizeBranding?.accentColor,
              }}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-red-50 border-red-200 mt-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <h4 className="font-semibold text-red-900">Medical Emergency</h4>
              <p className="text-red-800 text-sm mt-1">
                If you're experiencing a medical emergency, please call 911
                immediately or go to your nearest emergency room. Do not use
                this form for urgent medical concerns.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default SupportContactUsForm;
