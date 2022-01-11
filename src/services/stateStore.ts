import { Store as ReduxStore } from "@reduxjs/toolkit";
import { reduxStore, RootState } from "../reduxStore";

export class StateStore {
  constructor(private reduxStore: ReduxStore<RootState>) {}

  /**
   * getAuthState
   * : returns the auth state from store
   */
  public getAuthState() {
    return this.reduxStore.getState().auth;
  }
}

export default new StateStore(reduxStore);
