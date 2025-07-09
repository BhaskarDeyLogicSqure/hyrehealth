export type UserColourTheme = {
  name: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface IThemeResponseData {
  userColourTheme: UserColourTheme;
  companyLogo: string;
}