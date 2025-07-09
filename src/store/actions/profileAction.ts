import { ProfileFormData } from '@/types/profile';
import { createAction } from '@reduxjs/toolkit';

interface UserResponse extends Omit<ProfileFormData, 'address'> {
  userColourTheme?: {
    name: string;
    primaryColor: string;
    secondaryColor: string;
  };
  deletedAt: null | string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isDeleted: boolean;
  id: string;
}

interface ProfileApiResponseData {
  user: UserResponse;
}

// Action Types
export const SET_PROFILE = 'SET_PROFILE';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const SET_PROFILE_LOADING = 'SET_PROFILE_LOADING';
export const SET_PROFILE_ERROR = 'SET_PROFILE_ERROR';
export const CLEAR_PROFILE_ERROR = 'CLEAR_PROFILE_ERROR';

// Action Creators
export const setProfile = createAction<ProfileApiResponseData>(SET_PROFILE);
export const updateProfile = createAction<Partial<ProfileFormData>>(UPDATE_PROFILE);
export const setProfileLoading = createAction<boolean>(SET_PROFILE_LOADING);
export const setProfileError = createAction<string | null>(SET_PROFILE_ERROR);
export const clearProfileError = createAction(CLEAR_PROFILE_ERROR); 