import apiService from "..";
import { GET_QUESTIONNAIRE_ENDPOINT } from "@/api-helper/QuestionnaireEndpoint";
import { BASE_URL } from "@/configs";

export const questionnaireApi = {
  getQuestionnaire: async (
    productIds: string[]
  ): Promise<{
    data: any;
    total: number;
  }> => {
    const response = await apiService.post<{
      data: any;
      error: boolean;
    }>(BASE_URL + GET_QUESTIONNAIRE_ENDPOINT.endpoint, {
      productIds: productIds,
    });

    if (response?.error) {
      throw new Error("Error fetching questions");
    }

    let total = 0;
    if (response?.data && typeof response?.data === "object") {
      Object.keys(response?.data?.data)?.forEach((key) => {
        const value = (response?.data?.data as Record<string, any>)[key];
        if (Array.isArray(value)) {
          total += value?.length;
        }
      });
    }

    return {
      data: response?.data?.data,
      total: total,
    };
  },
};
