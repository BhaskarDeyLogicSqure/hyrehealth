import { UserDataType } from '@/types/user';
import { SET_USER, CLEAR_AUTH } from '../actionTypes';
// Initial State
export interface AuthState {
  user: UserDataType | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

// Reducer
export const authReducer = (state = initialState, action: any): AuthState => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };
    case CLEAR_AUTH:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
}; 