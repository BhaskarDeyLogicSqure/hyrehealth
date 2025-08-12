export interface OrderConfirmationResponse {
  status: boolean;
  data: {
    invoiceNumber: string;
    products: Array<{
      name: string;
      description: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }>;
    pricing: {
      subtotal: number;
      shippingCost: number;
      tax: number;
      discount: number;
      total: number;
      currency: string;
    };
  };
}

// Order confirmation payload interface
export interface OrderConfirmationPayload {
  orderId: string;
}

export interface IntakeFormQuestion {
  _id: string;
  title: string;
  description: string;
  merchantSpecific: boolean;
  merchant: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  status: string;
  question: {
    _id: string;
    questionText: string;
    questionType: string;
    options: Array<Record<string, any>>;
    validationRules: Record<string, any>;
    helpText: string;
  };
  isRequired: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Intake form questions response interface
export interface IntakeFormQuestionsResponse {
  status: boolean;
  data: {
    intakeForms: Array<IntakeFormQuestion>;
    count: number;
    pagination: {
      limit: number;
      page: number;
      pages: number;
      total: number;
    };
  };
}

export interface IntakeFormResponse {
  questionId: string;
  answer: any;
}

export interface IntakeFormSubmitResponse {
  error: boolean;
  message: string;
  data: {
    answerId: string;
    totalQuestions: number;
    submittedAt: string;
    respondentId: string;
    intakeFormId: string;
    merchantId: string;
  };
}

export interface IntakeFormResponsePayload {
  _intakeForm?: string;
  questionnaireResponses: Array<{
    _question: string | undefined;
    answer: string | string[] | undefined;
  }>;
}

export interface MeetingDetailsResponse {
  error: boolean;
  data: {
    meetingUuid: string;
    meetingLink: string;
  };
}
