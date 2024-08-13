import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile, ResetPassState, ForgotState } from "../../types/user";
import {
  getProfileThunk,
  getListThunk,
  updateProfileThunk,
  updatePasswordThunk,
  restoreUserThunk,
  getDeletedListThunk,
  updateUserThunk,
  verifyEmailThunk,
  getActiveListThunk,
  resetPasswordThunk,
  forgotPasswordThunk, // Import thunk
} from "./authThunk";
// interface User {
//   // Định nghĩa kiểu dữ liệu cho người dùng nếu cần
//   id: string;
//   name: string;
//   status: string;
// }
interface AuthState {
  login: {
    currentUser: string | null;
    isFetching: boolean;
    error: string | null;
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
  passwordUpdate: {
    status: string;
    successMessage: string | null;
    error: string | null;
  };
  // passwordMail: {
  //   status: "idle" | "loading" | "succeeded" | "failed";
  //   message: string | null;
  //   error: string | null;
  // };
  ForgotPassword: ForgotState;
  ResetPassword: ResetPassState;
  EmailVerification: {
    message: string | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  };

  users: any[];
  userListStatus: "idle" | "loading" | "succeeded" | "failed";
  userListError: string | null;

  deletedUsers: any[];
  deletedUsersStatus: "idle" | "loading" | "succeeded" | "failed";
  deletedUsersError: string | null;

  activeUsers: any[];
  activeUsersStatus: "idle" | "loading" | "succeeded" | "failed";
  activeUsersError: string | null;

  restoreUserStatus: "idle" | "loading" | "succeeded" | "failed";
  restoreUserError: string | null;
  updateUserStatus: "idle" | "loading" | "succeeded" | "failed";
  updateUserError: string | null;
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
  passwordUpdate: {
    status: "idle",
    successMessage: null,
    error: null,
  },
  EmailVerification: {
    message: null,
    status: "idle",
    error: null,
  },
  ForgotPassword: {
    status: "idle",
    message: "",
    error: null,
  },
  ResetPassword: {
    status: "idle",
    message: "",
    error: null,
  },
  activeUsers: [],
  activeUsersStatus: "idle",
  activeUsersError: null,

  users: [],
  deletedUsers: [],
  userListStatus: "idle",
  userListError: null,
  deletedUsersStatus: "idle",
  deletedUsersError: null,
  restoreUserStatus: "idle",
  restoreUserError: null,
  updateUserStatus: "idle",
  updateUserError: null,
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
    registerFailed: (state) => {
      state.register.isFetching = false;
      state.register.error = true;
      state.register.successMessage = null;
    },
    loginStart: (state) => {
      state.login.isFetching = true;
      state.login.error = null;
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
      state.login.error = null;
    },
    loginFailed: (state, action: PayloadAction<string>) => {
      state.login.isFetching = false;
      state.login.error = action.payload;
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
      state.profile.roles = action.payload.roles || [];
      state.profile.status = "succeeded";
    },
    setUserList: (state, action: PayloadAction<any[]>) => {
      state.users = action.payload;
    },
    setDeletedUsers: (state, action: PayloadAction<any[]>) => {
      state.deletedUsers = action.payload;
    },
    profileLoading(state) {
      state.profile.status = "loading";
    },
    profileFailed(state, action: PayloadAction<string>) {
      state.profile.status = "failed";
      state.profile.error = action.payload;
    },
    passwordUpdateStart(state) {
      state.passwordUpdate.status = "loading";
      state.passwordUpdate.error = null;
      state.passwordUpdate.successMessage = null;
    },
    passwordUpdateSuccess(state, action: PayloadAction<string>) {
      state.passwordUpdate.status = "succeeded";
      state.passwordUpdate.successMessage = action.payload;
      state.passwordUpdate.error = null;
    },
    passwordUpdateFailed(state, action: PayloadAction<string | null>) {
      state.passwordUpdate.status = "failed";
      state.passwordUpdate.error =
        action.payload || "An unknown error occurred";
      state.passwordUpdate.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfileThunk.pending, (state) => {
        state.profile.status = "loading";
      })
      .addCase(
        getProfileThunk.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.profile.status = "succeeded";
          state.profile.profile = action.payload;
          state.profile.roles = action.payload.roles || [];
          state.profile.error = null;
        }
      )
      .addCase(getProfileThunk.rejected, (state, action) => {
        state.profile.status = "failed";
        state.profile.error =
          (action.payload as string) || "An unknown error occurred";
      })
      .addCase(getListThunk.pending, (state) => {
        state.userListStatus = "loading";
        state.userListError = null;
      })
      .addCase(
        getListThunk.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.userListStatus = "succeeded";
          state.users = action.payload;
          state.userListError = null;
        }
      )
      .addCase(getListThunk.rejected, (state, action) => {
        state.userListStatus = "failed";
        state.userListError =
          (action.payload as string) || "An unknown error occurred";
      })
      .addCase(updateProfileThunk.pending, (state) => {
        state.profile.status = "loading";
      })
      .addCase(
        updateProfileThunk.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.profile.status = "succeeded";
          state.profile.profile = action.payload;
          state.profile.roles = action.payload.roles || [];
          state.profile.error = null;
        }
      )
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.profile.status = "failed";
        state.profile.error =
          (action.payload as string) || "An unknown error occurred";
      })
      .addCase(updatePasswordThunk.pending, (state) => {
        state.passwordUpdate.status = "loading";
        state.passwordUpdate.successMessage = null;
        state.passwordUpdate.error = null;
      })
      .addCase(
        updatePasswordThunk.fulfilled,
        (
          state,
          action: PayloadAction<{ status: number; message: string; data?: any }>
        ) => {
          state.passwordUpdate.status = "succeeded";
          state.passwordUpdate.successMessage = action.payload.message;
          state.passwordUpdate.error = null;
        }
      )
      .addCase(updatePasswordThunk.rejected, (state, action) => {
        state.passwordUpdate.status = "failed";
        state.passwordUpdate.successMessage = null;
        state.passwordUpdate.error =
          action.error.message || "Đã xảy ra lỗi khi cập nhật mật khẩu.";
      })

      .addCase(restoreUserThunk.pending, (state) => {
        state.restoreUserStatus = "loading";
        state.restoreUserError = null;
      })
      .addCase(restoreUserThunk.fulfilled, (state) => {
        state.restoreUserStatus = "succeeded";
        state.restoreUserError = null;
        // Cập nhật lại danh sách người dùng đã bị xóa mềm nếu cần
        // dispatch(getDeletedListThunk()); // Optional
      })
      .addCase(restoreUserThunk.rejected, (state, action) => {
        state.restoreUserStatus = "failed";
        state.restoreUserError =
          (action.payload as string) || "An unknown error occurred";
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.updateUserStatus = "loading";
        state.updateUserError = null;
      })
      .addCase(updateUserThunk.fulfilled, (state) => {
        state.updateUserStatus = "succeeded";
        // Cập nhật trạng thái người dùng nếu cần
        state.updateUserError = null;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.updateUserStatus = "failed";
        state.updateUserError =
          (action.payload as string) || "An unknown error occurred";
      })
      .addCase(verifyEmailThunk.pending, (state) => {
        state.EmailVerification.status = "loading";
        state.EmailVerification.error = null;
      })
      .addCase(verifyEmailThunk.fulfilled, (state, action) => {
        state.EmailVerification.status = "succeeded";
        state.EmailVerification.message = action.payload;
      })
      .addCase(verifyEmailThunk.rejected, (state, action) => {
        state.EmailVerification.status = "failed";
        state.EmailVerification.error = action.payload as string;
      })
      // .addCase(getActiveListThunk.pending, (state) => {
      //   state.active.status = "loading";
      //   state.active.error = null;
      // })
      // .addCase(
      //   getActiveListThunk.fulfilled,
      //   (state, action: PayloadAction<UserProfile[]>) => {
      //     state.active.status = "succeeded";
      //     state.active.data = action.payload;
      //   }
      // )
      // .addCase(getActiveListThunk.rejected, (state, action) => {
      //   state.active.status = "failed";
      //   state.active.error = action.payload as string;
      // })
      .addCase(getActiveListThunk.pending, (state) => {
        state.activeUsersStatus = "loading";
        state.activeUsersError = null;
      })
      .addCase(
        getActiveListThunk.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.activeUsersStatus = "succeeded";
          state.activeUsers = action.payload;
          state.activeUsersError = null;
        }
      )
      .addCase(getActiveListThunk.rejected, (state, action) => {
        state.activeUsersStatus = "failed";
        state.activeUsersError =
          (action.payload as string) || "An unknown error occurred";
      })

      .addCase(getDeletedListThunk.pending, (state) => {
        state.deletedUsersStatus = "loading";
        state.deletedUsersError = null;
      })
      .addCase(
        getDeletedListThunk.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.deletedUsersStatus = "succeeded";
          state.deletedUsers = action.payload;
          state.deletedUsersError = null;
        }
      )
      .addCase(getDeletedListThunk.rejected, (state, action) => {
        state.deletedUsersStatus = "failed";
        state.deletedUsersError =
          (action.payload as string) || "An unknown error occurred";
      })
      .addCase(forgotPasswordThunk.pending, (state) => {
        if (state.ForgotPassword) {
          state.ForgotPassword.status = "loading";
        }
      })
      .addCase(forgotPasswordThunk.fulfilled, (state, action) => {
        if (state.ForgotPassword) {
          state.ForgotPassword.status = "succeeded";
          state.ForgotPassword.message = action.payload;
        }
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        if (state.ForgotPassword) {
          state.ForgotPassword.status = "failed";
          state.ForgotPassword.error = action.payload as string;
        }
      })
      .addCase(resetPasswordThunk.pending, (state) => {
        if (state.ForgotPassword) {
          state.ForgotPassword.status = "loading";
        }
      })
      .addCase(resetPasswordThunk.fulfilled, (state, action) => {
        if (state.ForgotPassword) {
          state.ForgotPassword.status = "succeeded";
          state.ForgotPassword.message = action.payload;
        }
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        if (state.ForgotPassword) {
          state.ForgotPassword.status = "failed";
          state.ForgotPassword.error = action.payload as string;
        }
      });
  },
});

export const {
  registerStart,
  registerSuccess,
  registerFailed,
  loginStart,
  loginSuccess,
  loginFailed,
  logout,
  setProfile,
  setUserList,
  setDeletedUsers,
  profileLoading,
  profileFailed,
  passwordUpdateStart,
  passwordUpdateSuccess,
  passwordUpdateFailed,
} = authSlice.actions;

export default authSlice.reducer;
