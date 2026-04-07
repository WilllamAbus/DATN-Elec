// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { apiLoginSuccessThunk } from "./apiLoginSuccessThunk";
// import { LoginResponse, Role } from "../../types/user";
// interface AuthState {
//   login: {
//     isFetching: boolean;
//     error: string | null;
//     isAuthenticated: boolean;
//     token: string | null;
//     isLoggedIn: boolean;
//     roles: Role[];
//     currentUser: string | null;
//   };
// }
// const initialState: AuthState = {
//   login: {
//     isFetching: false,
//     isAuthenticated: false,
//     token: null,
//     isLoggedIn: false,
//     roles: [],
//     currentUser: null,
//     error: null,
//   },
// };
// const authSlice = createSlice({
//   name: "authGoogle",
//   initialState,
//   reducers: {
//     loginStart: (state) => {
//       state.login.isFetching = true;
//     },
//     loginSuccess: (
//       state,
//       action: PayloadAction<{
//         currentUser: string;
//         token: string;
//         roles: Role[];
//       }>
//     ) => {
//       state.login.isFetching = false;
//       state.login.currentUser = action.payload.currentUser;
//       state.login.token = action.payload.token ?? null;
//       state.login.isAuthenticated = true;
//       state.login.isLoggedIn = true;
//       state.login.error = null;
//       state.login.roles = action.payload.roles;
//     },
//     loginFailed: (state, action) => {
//       state.login.isFetching = false;
//       state.login.error = action.payload as string;
//       state.login.isAuthenticated = false;
//       state.login.isLoggedIn = false;
//     },
//     logout: (state) => {
//       state.login.currentUser = null;
//       state.login.token = null;
//       state.login.isAuthenticated = false;
//       state.login.isLoggedIn = false;
//       state.login.roles = [];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(apiLoginSuccessThunk.pending, (state) => {
//         state.login.isFetching = true;
//         state.login.error = null;
//       })
//       .addCase(
//         apiLoginSuccessThunk.fulfilled,
//         (state, action: PayloadAction<LoginResponse>) => {
//           state.login.isFetching = false;
//           state.login.currentUser = action.payload.currentUser;
//           state.login.token = action.payload.token ?? null;
//           state.login.isAuthenticated = true;
//           state.login.isLoggedIn = true;
//           state.login.error = null;
//           state.login.roles = action.payload.roles;
//         }
//       )
//       .addCase(apiLoginSuccessThunk.rejected, (state, action) => {
//         state.login.isFetching = false;
//         state.login.error = action.payload as string;
//         state.login.isAuthenticated = false;
//         state.login.isLoggedIn = false;
//       });
//   },
// });

// export const { loginStart, loginSuccess, loginFailed, logout } =
//   authSlice.actions;

// export default authSlice.reducer;
