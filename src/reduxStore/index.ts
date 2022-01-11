import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import claimsReducer from "./features/claimsSlice";
import payoutsReducer from "./features/payoutsSlice";

export const reduxStore = configureStore({
  reducer: {
    auth: authReducer,
    claims: claimsReducer,
    payouts: payoutsReducer,
  },
  devTools: true
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;
