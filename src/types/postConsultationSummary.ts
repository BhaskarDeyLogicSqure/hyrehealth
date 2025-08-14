export interface PostConsultationSummaryResponse {
  error: boolean;
  data: {
    consultation: Consultation;
    treatmentPlan: TreatmentPlan;
    orderSummary: OrderSummary;
  };
}

export interface Consultation {
  _id: string;
  consultationNumber: string;
  status: string;
  examStatus: string;
  rxStatus: string;
}

export interface TreatmentProduct {
  productName: string;
  strength: string;
  dosageInstructions: string;
  quantity: number;
  refills: number;
}

export interface TreatmentPlan {
  products: TreatmentProduct[];
  consultationValidUntil: string;
  dosageInstructions: string;
}

export interface NextBilling {
  amount: number;
  date: string;
}

export interface OrderSummary {
  orderNumber: string;
  consultationFee: number;
  firstMonthTreatment: number;
  shipping: string;
  totalPaid: number;
  currency: string;
  nextBilling: NextBilling;
}

export interface PostConsultationSummary {
  consultation: Consultation;
  treatmentPlan: TreatmentPlan;
  orderSummary: OrderSummary;
}
