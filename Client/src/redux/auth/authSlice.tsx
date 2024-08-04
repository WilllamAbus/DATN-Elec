// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { UserProfile } from "../../types/user";
// import { fetchProfile, login } from "./authThunk";

// interface AuthState {
//   login: {
//     status: "idle" | "loading" | "succeeded" | "failed";
//     currentUser: string | null;
//     isFetching: boolean;
//     error: string | null;
//     isAuthenticated: boolean;
//   };
//   profile: {
//     profile: UserProfile | null;
//     roles: string | null;
//     status: "idle" | "loading" | "succeeded" | "failed";
//     error: string | null;
//   };
// }

// const initialState: AuthState = {
//   login: {
//     status: "idle",
//     currentUser: null,
//     isFetching: false,
//     error: null,
//     isAuthenticated: false,
//   },
//   profile: {
//     profile: null,
//     roles: null,
//     status: "idle",
//     error: null,
//   },
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     loginStart(state) {
//       state.login.isFetching = true;
//     },
//     loginSuccess(state, action: PayloadAction<string>) {
//       state.login.isFetching = false;
//       state.login.currentUser = action.payload;
//       state.login.isAuthenticated = true;
//       state.login.error = null;
//     },
//     loginFailed(state) {
//       state.login.isFetching = false;
//       state.login.error = null;
//       state.login.isAuthenticated = false;
//     },
//     logout(state) {
//       state.login.currentUser = null;
//       state.login.isAuthenticated = false;
//     },
//     setProfile(state, action: PayloadAction<UserProfile>) {
//       state.profile.profile = action.payload;
//     },
//     clearProfile(state) {
//       state.profile.profile = null;
//     },
//   },
//   extraReducers: (builder) => {
//     // Đăng nhập
//     builder
//       .addCase(login.pending, (state) => {
//         state.login.status = "loading";
//         state.login.isFetching = true;
//         state.login.error = null;
//       })
//       .addCase(login.fulfilled, (state, action: PayloadAction<UserProfile>) => {
//         state.login.status = "succeeded";
//         state.login.isFetching = false;
//         state.login.currentUser = action.payload.accessToken; // Hoặc thông tin cần thiết
//         state.login.isAuthenticated = true;
//         state.login.error = null;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.login.status = "failed";
//         state.login.isFetching = false;
//         state.login.error = action.payload as string;
//         state.login.isAuthenticated = false;
//       })
//       // Lấy thông tin người dùng
//       .addCase(fetchProfile.pending, (state) => {
//         state.profile.status = "loading";
//         state.profile.error = null;
//       })
//       .addCase(
//         fetchProfile.fulfilled,
//         (state, action: PayloadAction<UserProfile>) => {
//           state.profile.status = "succeeded";
//           state.profile.profile = action.payload;
//         }
//       )
//       .addCase(fetchProfile.rejected, (state, action) => {
//         state.profile.status = "failed";
//         state.profile.error = action.payload as string; // Đảm bảo payload là string
//       });
//   },
// });

// export const {
//   loginStart,
//   loginSuccess,
//   loginFailed,
//   logout,
//   setProfile,
//   clearProfile,
// } = authSlice.actions;

// export default authSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "../../types/user";

interface AuthState {
  login: {
    currentUser: string | null;
    isFetching: boolean;
    error: boolean;
    isAuthenticated: boolean;
    token: string | null;
    isLoggedIn: boolean;
  };
  profile: {
    profile: UserProfile | null;
    roles: string | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
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
  },
  profile: {
    profile: null,
    roles: null,
    status: "idle",
    error: null,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.login.isFetching = true;
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
      state.login.error = false;
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
    },
    setProfile(state, action: PayloadAction<UserProfile>) {
      state.profile.profile = action.payload;
    },
  },
});

export const { loginStart, loginSuccess, loginFailed, logout, setProfile } =
  authSlice.actions;

export default authSlice.reducer;
