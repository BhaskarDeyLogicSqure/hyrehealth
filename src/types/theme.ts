export interface IThemeResponseData {
  ok: boolean;
  userColourTheme: Theme;
  companyLogo: string;
}

export const enum Theme {
  DEFAULT = "modern",
  CLASSIC = "classic",
}
