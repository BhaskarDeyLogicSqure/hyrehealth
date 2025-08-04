import apiService from "@/api";
import {
  INTAKE_FORM_QUESTIONS_ENDPOINT,
  ORDER_CONFIRMATION_DETAILS_ENDPOINT,
  SUBMIT_INTAKE_FORM_QUESTIONS_ENDPOINT,
} from "@/api-helper/ChekoutEndpoints";
import {
  IntakeFormQuestionsResponse,
  IntakeFormResponsePayload,
  IntakeFormSubmitResponse,
  OrderConfirmationResponse,
} from "@/types/intakeForms";

// Order confirmation response interface

export const postCheckoutApi = {
  // Get order confirmation details
  getOrderConfirmation: async (
    orderId: string
  ): Promise<OrderConfirmationResponse> => {
    try {
      if (!orderId) {
        throw new Error("Order ID is required");
      }

      const response = await apiService.get<OrderConfirmationResponse>(
        `${ORDER_CONFIRMATION_DETAILS_ENDPOINT.endpoint}/${orderId}`
      );

      return {
        data: response?.data,
        status: response?.status,
      };
    } catch (error) {
      console.error("Order confirmation API error:", error);
      throw error;
    }
  },

  // get intake form questions
  getIntakeFormQuestions: async (): Promise<IntakeFormQuestionsResponse> => {
    try {
      const response = await apiService.post<IntakeFormQuestionsResponse>(
        `${INTAKE_FORM_QUESTIONS_ENDPOINT.endpoint}`
      );

      return response?.data;
    } catch (error) {
      console.error("Intake form questions API error:", error);
      throw error;
    }
  },

  // submit intake form questions with answers
  submitIntakeFormQuestions: async (
    payload: IntakeFormResponsePayload
  ): Promise<IntakeFormSubmitResponse> => {
    try {
      const response = await apiService.post<IntakeFormSubmitResponse>(
        `${SUBMIT_INTAKE_FORM_QUESTIONS_ENDPOINT.endpoint}`,
        payload
      );

      console.log({ response });
      return {
        data: response?.data?.data,
        error: response?.data?.error || false,
        message: response?.data?.message || "",
      };
    } catch (error) {
      console.error("Intake form questions submit API error:", error);
      throw error;
    }
  },
};
