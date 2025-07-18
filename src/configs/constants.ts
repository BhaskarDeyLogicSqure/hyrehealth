export const MAX_FILE_SIZE_MB = 5;

export const treatmentCategories = [
  {
    id: 1,
    name: "Weight Loss",
    description:
      "Effective weight management solutions including GLP-1 medications",
    productCount: 8,
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    id: 2,
    name: "Peptides",
    description: "Advanced peptide therapies for recovery and performance",
    productCount: 12,
    color: "bg-purple-50 text-purple-600 border-purple-200",
  },
  {
    id: 3,
    name: "Wellness",
    description: "Comprehensive wellness and longevity support",
    productCount: 15,
    color: "bg-green-50 text-green-600 border-green-200",
  },
  {
    id: 4,
    name: "Hormone Therapy",
    description: "Hormone optimization and replacement therapy",
    productCount: 6,
    color: "bg-red-50 text-red-600 border-red-200",
  },
  {
    id: 5,
    name: "Immune Support",
    description: "Boost your immune system with targeted treatments",
    productCount: 9,
    color: "bg-orange-50 text-orange-600 border-orange-200",
  },
  {
    id: 6,
    name: "Cognitive Enhancement",
    description: "Mental clarity and cognitive performance optimization",
    productCount: 7,
    color: "bg-indigo-50 text-indigo-600 border-indigo-200",
  },
];

// support contact methods
export const contactMethods = [
  {
    method: "Phone Support",
    description: "Speak with a support specialist",
    availability: "Mon-Fri 8AM-8PM EST",
    icon: "Phone",
    action: "Call Now",
    primary: true,
    contact: "123-456-7890",
  },
  {
    method: "Email Support",
    description: "Send us a detailed message",
    availability: "Response within 24 hours",
    icon: "Mail",
    action: "Email Now",
    primary: false,
    contact: "support@healthportal.com",
  },
];

// FAQ's list
export const faqs = [
  {
    id: 1,
    question: "How long does it take to get approved?",
    answer:
      "Most patients receive approval within 24-48 hours after completing their consultation. Our licensed physicians review each case individually to ensure the treatment is safe and appropriate for you.",
    category: "General",
  },
  {
    id: 2,
    question: "What if I don't qualify for treatment?",
    answer:
      "If you don't qualify for your initial treatment choice, our medical team will recommend alternative options that may be suitable for your health profile and goals.",
    category: "Treatment",
  },
  {
    id: 3,
    question: "How is my medication shipped?",
    answer:
      "All medications are shipped in discreet, temperature-controlled packaging directly from our certified pharmacy. Most orders arrive within 2-3 business days.",
    category: "Shipping",
  },
  {
    id: 4,
    question: "Can I pause or cancel my subscription?",
    answer:
      "Yes, you can pause or cancel your subscription at any time through your account dashboard. Paused subscriptions can be resumed when you're ready to continue treatment.",
    category: "Billing",
  },
  {
    id: 5,
    question: "What if I experience side effects?",
    answer:
      "Contact our medical team immediately if you experience any concerning side effects. We provide 24/7 support and can adjust your treatment plan as needed.",
    category: "Treatment",
  },
  {
    id: 6,
    question: "Are consultations covered by insurance?",
    answer:
      "Currently, our consultations and treatments are not covered by insurance. We keep our prices competitive and transparent with no hidden fees.",
    category: "Billing",
  },
];

export const howItWorks = [
  {
    step: 1,
    title: "Choose Treatment",
    description: "Browse our categories and select the right treatment for you",
  },
  {
    step: 2,
    title: "Complete Consultation",
    description: "Answer health questions and speak with our medical team",
  },
  {
    step: 3,
    title: "Get Approved",
    description: "Receive your personalized treatment plan and dosage",
  },
  {
    step: 4,
    title: "Start Treatment",
    description: "Your medication is delivered monthly to your door",
  },
];
