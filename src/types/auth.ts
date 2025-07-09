import { UserDataType } from "./user";


export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ILoginResponseData {
  user: UserDataType;
  token: string;
}