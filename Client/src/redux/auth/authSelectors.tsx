import { createSelector } from "reselect";
import { RootState } from "../store";

const selectAuthState = (state: RootState) => state.auth;

export const selectPasswordUpdate = createSelector(
  [selectAuthState],
  (authState) => authState.passwordUpdate
);
