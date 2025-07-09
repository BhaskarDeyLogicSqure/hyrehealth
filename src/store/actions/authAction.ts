import { UserDataType } from "@/types/user";
import { CLEAR_AUTH, SET_USER } from "../actionTypes";

export const setUser = (user: UserDataType | null) => ({
  type: SET_USER,
  payload: user,
});

export const clearAuth = () => ({
  type: CLEAR_AUTH,
});
