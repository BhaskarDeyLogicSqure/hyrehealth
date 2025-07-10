import axios from "axios";
import { BASE_URL } from "@/configs";
import { ApiResponse } from "@/types";
import { IThemeResponseData } from "@/types/theme";
import { useQuery } from "@tanstack/react-query";

// api call to get theme data from backend
const themeApi = {
  getTheme: async (): Promise<ApiResponse<IThemeResponseData | null>> => {
    const response = await axios.get(`${BASE_URL}/theme`);
    return response.data;
  },
};

// useQuery wrapper to fetch theme data from backend
export const getTheme = useQuery({
  queryKey: ["theme"],
  queryFn: themeApi.getTheme,
});
