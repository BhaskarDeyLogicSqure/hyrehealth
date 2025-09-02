import { createSlice } from "@reduxjs/toolkit";
import { MerchantNMIpaymentTokenResponse } from "@/types/auth";

const initialState = {
  merchantData: null as MerchantNMIpaymentTokenResponse["data"] | null,
};

export const merchantSlice = createSlice({
  name: "merchant",
  initialState,
  reducers: {
    setMerchantData: (
      state,
      action: { payload: MerchantNMIpaymentTokenResponse["data"] }
    ) => {
      state.merchantData = action?.payload;
    },
  },
});

export const { setMerchantData } = merchantSlice.actions;

export const merchantReducer = merchantSlice.reducer;
