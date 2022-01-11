import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import { IBaseState } from "./baseState";

interface IAuthState extends Partial<IBaseState> {
  loggedIn: boolean;
}

const initialState: IAuthState = {
  loggedIn: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    },
  },
});

// Actions
export const { setLoggedIn } = authSlice.actions;


// Selectors
// export const selectCount = (state: RootState) => state.counter.value;

// Reducer
export default authSlice.reducer;
