import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "../../types/user";

interface AuthState {
  login: {
    currentUser: string | null;
    isFetching: boolean;
    error: string | null; // Đổi từ boolean thành string để lưu thông tin lỗi
    isAuthenticated: boolean;
    token: string | null;
    isLoggedIn: boolean;
  };
  profile: {
    profile: UserProfile | null;
    roles: string[] | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  };
  register: {
    isFetching: boolean;
    error: boolean;
    successMessage: string | null;
  };
  users: UserProfile[]; 
}

const initialState: AuthState = {
  login: {
    currentUser: null,
    isFetching: false,
    error: null,
    isAuthenticated: false,
    token: null,
    isLoggedIn: false,
  },
  profile: {
    profile: null,
    roles: null,
    status: "idle",
    error: null,
  },
  register: {
    isFetching: false,
    error: false,
    successMessage: null,
  },
  users: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerStart: (state) => {
      state.register.isFetching = true;
    },
    registerSuccess: (state, action: PayloadAction<string>) => {
      state.register.isFetching = false;
      state.register.successMessage = action.payload;
      state.register.error = false;
    },
    registerFailed: (state, action: PayloadAction<string>) => {
      state.register.isFetching = false;
      state.register.error = true;
      state.register.successMessage = null;
    },
    loginStart: (state) => {
      state.login.isFetching = true;
      state.login.error = null; // Reset lỗi khi bắt đầu đăng nhập
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ currentUser: string; token: string }>
    ) => {
      state.login.isFetching = false;
      state.login.currentUser = action.payload.currentUser;
      state.login.token = action.payload.token;
      state.login.isAuthenticated = true;
      state.login.isLoggedIn = true;
      state.login.error = null; // Reset lỗi khi đăng nhập thành công
    },
    loginFailed: (state, action: PayloadAction<string>) => {
      state.login.isFetching = false;
      state.login.error = action.payload; // Lưu thông tin lỗi
      state.login.isAuthenticated = false;
      state.login.isLoggedIn = false;
    },
    logout: (state) => {
      state.login.currentUser = null;
      state.login.token = null;
      state.login.isAuthenticated = false;
      state.login.isLoggedIn = false;
    },
    setProfile(state, action: PayloadAction<UserProfile>) {
      state.profile.profile = action.payload;
      state.profile.roles = action.payload.roles; // Cập nhật vai trò
      state.profile.status = "succeeded"; // Đánh dấu trạng thái thành công
    },
    setUserList(state, action: PayloadAction<UserProfile[]>) {
      state.users = action.payload;
    },
    profileLoading(state) {
      state.profile.status = "loading";
    },
    profileFailed(state, action: PayloadAction<string>) {
      state.profile.status = "failed";
      state.profile.error = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailed,
  logout,
  setProfile,
  setUserList,
  profileLoading,
  profileFailed,
  registerFailed,
  registerStart,
  registerSuccess,
} = authSlice.actions;

export default authSlice.reducer;
