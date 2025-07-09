import { useQuery } from "@tanstack/react-query";
import { themeApi } from "./themeApi";

export const useTheme = () => {
  const getTheme = useQuery({
    queryKey: ["theme"],
    queryFn: themeApi.getTheme,
  });

  const applyTheme = () => {
    const theme = getTheme.data;
    const { userColourTheme } = theme?.data || {};
    const { primaryColor, secondaryColor } = userColourTheme || {};
    document.documentElement.style.setProperty(
      "--brand-dark-blue",
      primaryColor || ""
    );
    document.documentElement.style.setProperty(
      "--brand-gold",
      secondaryColor || ""
    );
  };

  return {
    themeData: getTheme.data,
    isLoading: getTheme.isLoading,
    isError: getTheme.isError,
    error: getTheme.error,
    applyTheme,
  };
};
