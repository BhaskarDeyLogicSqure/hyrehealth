import { ThemeName } from "@/lib/theme-utils";

export interface IThemeResponseData {
  ok: boolean;
  userColourTheme: ThemeName;
  companyLogo: string;
}
