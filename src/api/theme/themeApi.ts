import axios from "axios";
import { BASE_URL } from "@/configs";
import { ApiResponse } from "@/types";
import { IThemeResponseData } from "@/types/theme";

export const themeApi = {
  getTheme: async (): Promise<ApiResponse<IThemeResponseData | null>> => {
    const response = await axios.get(`${BASE_URL}/fetch/basic`);
    return response.data;
  },
};  