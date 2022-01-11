import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import { IBaseState } from "./baseState";

interface IClaimsState extends Partial<IBaseState> {
  claimsProcessing: { address: string; status: string; receipt: string, slp: number }[];
  done: boolean;
}

const initialState: IClaimsState = {
  claimsProcessing: [],
  done: false,
};

export const claimsSlice = createSlice({
  name: "claims",
  initialState,
  reducers: {
    setClaimsDone: (state, action: PayloadAction<boolean>) => {
      state.done = action.payload;
    },
    setClaimStatus: (
      state,
      action: PayloadAction<{
        address: string;
        status: string;
        receipt: string;
        slp: number;
      }>
    ) => {
      const claimFound = state.claimsProcessing.find(
        (claim) => claim.address == action.payload.address
      );
      if (claimFound) {
        state.claimsProcessing = state.claimsProcessing.map((claim) => {
          if (claim.address == action.payload.address) {
            return { ...action.payload };
          }
          return claim;
        });
      } else {
        state.claimsProcessing = [...state.claimsProcessing, action.payload];
      }
    },
  },
});

// Actions
export const { setClaimStatus, setClaimsDone } = claimsSlice.actions;

// Selectors
export const selectClaims = (state: RootState) => state.claims;

// Reducer
export default claimsSlice.reducer;
