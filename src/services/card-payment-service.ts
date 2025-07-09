import { BASE_URL, X_API_KEY } from "../configs";
import { ApiResponse, Card, CardPaymentRequest, CardPaymentResponse } from "../types/payment";

// Card Types - Updated based on typical Stripe API response
export interface FetchCardsResponse {
  cards: Card[];
  hasMore: boolean;
  totalCount: number;
}

export interface CreateCardRequest {
  token: string; // Stripe token
}

export interface CreatePaymentIntentResponse {
  success: boolean;
  clientSecret: string;
  message?: string;
}

export class CardPaymentService {
  private baseHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(X_API_KEY && { "x-API-key": X_API_KEY }),
  };

  /**
   * Fetch all cards for the user
   */
  async fetchAllCards(
    userToken: string
  ): Promise<ApiResponse<FetchCardsResponse>> {
    try {
      const response = await fetch(`${BASE_URL}/user/stripe/cards`, {
        method: "GET",
        headers: {
          ...this.baseHeaders,
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<FetchCardsResponse> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch cards");
      }

      return result;
    } catch (error) {
      console.error("Error fetching cards:", error);
      throw error;
    }
  }

  /**
   * Add a new card
   */
  async addCard(
    userToken: string,
    createCardRequest: CreateCardRequest
  ): Promise<ApiResponse<Card>> {
    try {
      const response = await fetch(`${BASE_URL}/user/stripe/add-card`, {
        method: "POST",
        headers: {
          ...this.baseHeaders,
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(createCardRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Card> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to add card");
      }

      return result;
    } catch (error) {
      console.error("Error adding card:", error);
      throw error;
    }
  }

  /**
   * Make a card default
   */
  async makeCardDefault(
    userToken: string,
    cardId: string
  ): Promise<ApiResponse<Card>> {
    try {
      const response = await fetch(`${BASE_URL}/user/stripe/default-card`, {
        method: "POST",
        headers: {
          ...this.baseHeaders,
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ cardId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Card> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to make card default");
      }

      return result;
    } catch (error) {
      console.error("Error making card default:", error);
      throw error;
    }
  }

  /**
   * Create Payment Intent for 3D Secure flow
   */
  async createPaymentIntent(
    userToken: string,
    amount: number,
    currency: string = "usd"
  ): Promise<CreatePaymentIntentResponse> {
    try {
      const response = await fetch(`${BASE_URL}/user/stripe/create-intent`, {
        method: "POST",
        headers: {
          ...this.baseHeaders,
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ amount, currency }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: CreatePaymentIntentResponse = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to create payment intent");
      }

      return result;
    } catch (error) {
      console.error("Error creating payment intent:", error);
      throw error;
    }
  }

  /**
   * Delete a card
   */
  async deleteCard(
    userToken: string,
    cardId: string
  ): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${BASE_URL}/user/stripe/cards/${cardId}`, {
        method: "DELETE",
        headers: {
          ...this.baseHeaders,
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<void> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to delete card");
      }

      return result;
    } catch (error) {
      console.error("Error deleting card:", error);
      throw error;
    }
  }

  /**
   * Process card payment - Keep for backward compatibility
   * @deprecated Use createPaymentIntent instead for 3D Secure support
   */
  async processCardPayment(
    userToken: string,
    paymentDetails: CardPaymentRequest
  ): Promise<ApiResponse<CardPaymentResponse>> {
    try {
      const response = await fetch(`${BASE_URL}/user/stripe/payments`, {
        method: "POST",
        headers: {
          ...this.baseHeaders,
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          ...paymentDetails,
          currency: paymentDetails.currency || "usd",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<CardPaymentResponse> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to process card payment");
      }

      return result;
    } catch (error) {
      console.error("Error processing card payment:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const cardPaymentService = new CardPaymentService(); 