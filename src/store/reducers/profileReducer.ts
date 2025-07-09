import { createReducer } from '@reduxjs/toolkit';
import { ProfileFormData } from '@/types/profile';
import {
  setProfile,
  updateProfile,
  setProfileLoading,
  setProfileError,
  clearProfileError,
} from '../actions/profileAction';

export interface ProfileState {
  profile: ProfileFormData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

export const profileReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setProfile, (state, action) => {
      const userData = action.payload.user;
      state.profile = {
        fullName: userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        company: userData.companyName || '',
        companyName: userData.companyName || '',
        companyAddress: userData.companyAddress || '',
        companyWebsite: userData.companyWebsite || '',
        companyLogo: userData.companyLogo || '',
        website: userData.companyWebsite || '',
        addressLine1: userData.addressLine1 || '',
        addressLine2: userData.addressLine2 || '',
        city: userData.city || '',
        state: userData.state || '',
        zip: userData.zip || '',
        country: userData.country || 'USA',
        username: userData.username || '',
        accountType: userData.accountType || '',
        isAdmin: userData.isAdmin || false,
        role: userData.role || '',
        isActive: userData.isActive || false,
        status: userData.status || '',
        phoneCountry: userData.phoneCountry || '',
      };
    })
    .addCase(updateProfile, (state, action) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    })
    .addCase(setProfileLoading, (state, action) => {
      state.loading = action.payload;
    })
    .addCase(setProfileError, (state, action) => {
      state.error = action.payload;
    })
    .addCase(clearProfileError, (state) => {
      state.error = null;
    });
}); 