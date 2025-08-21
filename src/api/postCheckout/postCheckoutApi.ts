import apiService from "@/api";
import {
  INTAKE_FORM_QUESTIONS_ENDPOINT,
  MEETING_DETAILS_ENDPOINT,
  MERCHANT_NMI_PAYMENT_TOKEN_ENDPOINT,
  ORDER_CONFIRMATION_DETAILS_ENDPOINT,
  POST_CONSULTATION_SUMMARY_ENDPOINT,
  RENEWAL_DETAILS_ENDPOINT,
  SUBMIT_INTAKE_FORM_QUESTIONS_ENDPOINT,
} from "@/api-helper/ChekoutEndpoints";
import { MerchantNMIpaymentTokenResponse } from "@/types/auth";
import {
  IntakeFormQuestionsResponse,
  IntakeFormResponsePayload,
  IntakeFormSubmitResponse,
  MeetingDetailsResponse,
  OrderConfirmationResponse,
} from "@/types/intakeForms";
import { PostConsultationSummaryResponse } from "@/types/postConsultationSummary";
import { RenewalDetailsResponse } from "@/types/renewalDetails";

// Order confirmation response interface

export const postCheckoutApi = {
  // Get order confirmation details
  getOrderConfirmation: async (
    orderId: string | null
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

  // get meeting id for meeting schedule
  getMeetingDetails: async (
    invoiceId: string
  ): Promise<MeetingDetailsResponse> => {
    try {
      const response = await apiService.get<MeetingDetailsResponse>(
        `${MEETING_DETAILS_ENDPOINT.endpoint}/${invoiceId}`
      );

      return {
        data: response?.data,
        error: response?.error || false,
      };
    } catch (error) {
      console.error("Meeting details API error:", error);
      throw error;
    }
  },

  // get renewal details
  getRenewalDetails: async (
    subscriptionId: string
  ): Promise<RenewalDetailsResponse> => {
    try {
      const response = await apiService.get<RenewalDetailsResponse>(
        `${RENEWAL_DETAILS_ENDPOINT.endpoint}/${subscriptionId}/renewal-details`
      );

      return {
        error: response?.error || false,
        data: response?.data,
      };
    } catch (error) {
      console.error("Renewal details API error:", error);
      throw error;
    }
  },

  // get post consultation summary
  getPostConsultationSummary: async (
    consultationId: string
  ): Promise<PostConsultationSummaryResponse> => {
    try {
      const response = await apiService.get<PostConsultationSummaryResponse>(
        `${POST_CONSULTATION_SUMMARY_ENDPOINT.endpoint}/${consultationId}/completion`
      );

      return {
        error: response?.error || false,
        data: response?.data,
      };
    } catch (error) {
      console.error("Post consultation summary API error:", error);
      throw error;
    }
  },

  // get merchant's NMI payment token for payment processing
  getMerchantNMITokenizationKey:
    async (): Promise<MerchantNMIpaymentTokenResponse> => {
      try {
        const response = await apiService.get<MerchantNMIpaymentTokenResponse>(
          `${MERCHANT_NMI_PAYMENT_TOKEN_ENDPOINT.endpoint}`
        );

        return {
          error: response?.error || false,
          data: response?.data,
        };
      } catch (error) {
        console.error("Merchant NMI tokenization key API error:", error);
        throw error;
      }
    },
};
