import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { linkAccountThunk } from "../Thunk";
import { LoginResponse, Role } from "../../../types/user";

interface AuthState {
  linkAccount: {
    isFetching: boolean;
    error: string | null;
    email: string | null;
    googleId: string | null;
    successMessage: string | null;
    isAuthenticated: boolean;
    isLogin: boolean; 
    token: string | null;
    isLoggedIn: boolean;
    roles: Role[];
    currentUser: string | null;
  };
}

const initialState: AuthState = {
  linkAccount: {
    isFetching: false,
    error: null,
    email: null,
    googleId: null,
    successMessage: null,
    isAuthenticated: false,
    isLogin: false, 
    token: null,
    isLoggedIn: false,
    roles: [],
    currentUser: null,
  },
};

const linkAccountSlice = createSlice({
  name: "linkAccount",
  initialState,
  reducers: {
    linkAccountStart: (state) => {
      state.linkAccount.isFetching = true;
    },
    linkAccountSuccess: (state, action: PayloadAction<LoginResponse>) => {
      state.linkAccount.isFetching = false;
      state.linkAccount.email = action.payload.email || null;
      state.linkAccount.googleId = action.payload.googleId || null;
      state.linkAccount.token = action.payload.token || null;
      state.linkAccount.roles = action.payload.roles;
      state.linkAccount.successMessage = action.payload.message || null;
      state.linkAccount.error = null;
      state.linkAccount.isAuthenticated = true;
      state.linkAccount.isLoggedIn = true;
      state.linkAccount.isLogin = true; 
    },
    linkAccountFailed: (state, action: PayloadAction<string>) => {
      state.linkAccount.isFetching = false;
      state.linkAccount.error = action.payload;
      state.linkAccount.email = null;
      state.linkAccount.googleId = null;
      state.linkAccount.successMessage = null;
      state.linkAccount.isLoggedIn = false;
      state.linkAccount.isLogin = false; 
    },
    logout: (state) => {
      state.linkAccount.isLoggedIn = false;
      state.linkAccount.isLogin = false; 
      state.linkAccount.email = null;
      state.linkAccount.googleId = null;
      state.linkAccount.token = null;
      state.linkAccount.roles = [];
      state.linkAccount.successMessage = null;
      state.linkAccount.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(linkAccountThunk.pending, (state) => {
        console.log("Pending state:", state);
        state.linkAccount.isFetching = true;
        state.linkAccount.error = null;
      })
      .addCase(linkAccountThunk.fulfilled, (state, action: PayloadAction<LoginResponse & { token?: string }>) => {
        state.linkAccount.isFetching = false;
        state.linkAccount.email = action.payload.email || null;
        state.linkAccount.googleId = action.payload.googleId || null;
        state.linkAccount.token = action.payload.token || null;
        state.linkAccount.roles = action.payload.roles;
        state.linkAccount.successMessage = action.payload.message || null;
        state.linkAccount.error = null;
        state.linkAccount.isLoggedIn = true;
        state.linkAccount.isLogin = true; 
      })
      .addCase(linkAccountThunk.rejected, (state, action) => {
        state.linkAccount.isFetching = false;
        state.linkAccount.error = action.payload as string;
        state.linkAccount.email = null;
        state.linkAccount.googleId = null;
        state.linkAccount.successMessage = null;
        state.linkAccount.token = null;
        state.linkAccount.isLoggedIn = false;
        state.linkAccount.isLogin = false; 
      });
  },
});

export const { linkAccountStart, linkAccountSuccess, linkAccountFailed, logout } = linkAccountSlice.actions;

export default linkAccountSlice.reducer;
