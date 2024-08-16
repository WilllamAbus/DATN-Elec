import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Permission {
  name: string;
  resources: string[];
}

interface Role {
  _id: string;
  roleId: string;
  name: string;
  permissions: Permission[];
}

interface AuthState {
  login: {
    currentUser: string | null;
    isFetching: boolean;
    error: boolean;
    isAuthenticated: boolean;
    token: string | null;
    isLoggedIn: boolean;
    roles: Role[];
  };
}

const initialState: AuthState = {
  login: {
    currentUser: null,
    isFetching: false,
    error: false,
    isAuthenticated: false,
    token: null,
    isLoggedIn: false,
    roles: [],
  },
};

const authSlice = createSlice({
  name: "authGoogle",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.login.isFetching = true;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ currentUser: string; token: string; roles: Role[] }>
    ) => {
      state.login.isFetching = false;
      state.login.currentUser = action.payload.currentUser;
      state.login.token = action.payload.token;
      state.login.isAuthenticated = true;
      state.login.isLoggedIn = true;
      state.login.error = false;
      state.login.roles = action.payload.roles;
    },
    loginFailed: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
      state.login.isAuthenticated = false;
      state.login.isLoggedIn = false;
    },
    logout: (state) => {
      state.login.currentUser = null;
      state.login.token = null;
      state.login.isAuthenticated = false;
      state.login.isLoggedIn = false;
      state.login.roles = [];
    },
  },
});

export const { loginStart, loginSuccess, loginFailed, logout } = authSlice.actions;

export default authSlice.reducer;
