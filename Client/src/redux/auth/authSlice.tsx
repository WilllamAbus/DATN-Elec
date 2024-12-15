import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  UserProfile,
  Role,
  ResetPassState,
  ForgotState,
  Address,
  AddressResponse,
  Pagination,
  LimitCrudUserResponse,
  Userpagi,

  // LoginResponse,
} from "../../types/user";
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
  loginUserThunk,
  logoutThunk,
  softDeleteUserThunk,
  forgotPasswordThunk,
  resendEmailThunk,
  fetchUserById,
  getlistRoleThunk,
  fetchAddressListThunk,
  deleteAddressThunk,
  addAddressThunk,
  setDefaultAddressThunk,
  editAddressThunk,
  fetchAddressByIdThunk,
  fetchPaginatedUser,
  // addAddressThunk,
  // updateAddressThunk,
  // deleteAddressThunk,
} from "./authThunk";
import { apiLoginSuccessThunk } from "./apiLoginSuccessThunk";
import { LoginResponse } from "../../types/user";
interface AuthState {
  role: {
    roles: Role[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  };
  login: {
    currentUser: string | null;
    isFetching: boolean;
    error: string | null;
    isAuthenticated: boolean;
    token: string | null;
    isLoggedIn: boolean;
    roles: Role[];
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
  resendEmail: {
    message: string;
    error: string;
    status: "idle" | "pending" | "succeeded" | "failed";
  };
  fetchUser: {
    user: UserProfile | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  };

  ForgotPassword: ForgotState;
  ResetPassword: ResetPassState;
  EmailVerification: {
    message: string | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  };

  users: UserProfile[];
  userpagi: Userpagi[];
  userListStatus: "idle" | "loading" | "succeeded" | "failed";
  userListError: string | null;
  deleyedpagi: Userpagi[];
  deletedUsers: UserProfile[];
  deletedUsersStatus: "idle" | "loading" | "succeeded" | "failed";
  deletedUsersError: string | null;

  activeUsers: UserProfile[];
  activeUsersStatus: "idle" | "loading" | "succeeded" | "failed";
  activeUsersError: string | null;

  restoreUserStatus: "idle" | "loading" | "succeeded" | "failed";
  restoreUserError: string | null;
  updateUserStatus: "idle" | "loading" | "succeeded" | "failed";
  updateUserError: string | null;

  roles: string[] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;

  addresses: Address[];
  selectedAddress: Address | null;
  loading: boolean;

  // AddressState: {
  //   addresses: AddressResponse[];
  //   status: "idle" | "loading" | "succeeded" | "failed";
  //   error: string | null;
  // };

  pagination: Pagination | null;
}

const initialState: AuthState = {
  role: {
    roles: [],
    status: "idle",
    error: null,
  },
  login: {
    currentUser: null,
    isFetching: false,
    error: null,
    isAuthenticated: false,
    token: null,
    roles: [],
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
  resendEmail: {
    message: "",
    error: "",
    status: "idle",
  },
  ForgotPassword: {
    status: null,
    message: null,
    loading: false,
    error: null,
  },
  ResetPassword: {
    status: "idle",
    message: "",
    error: null,
  },
  fetchUser: {
    user: null,
    status: "idle",
    error: null,
  },
  activeUsers: [],
  activeUsersStatus: "idle",
  activeUsersError: null,

  roles: null,
  status: "idle",
  error: null,

  users: [],
  userpagi: [],
  deleyedpagi: [],
  deletedUsers: [],
  userListStatus: "idle",
  userListError: null,
  deletedUsersStatus: "idle",
  deletedUsersError: null,
  restoreUserStatus: "idle",
  restoreUserError: null,
  updateUserStatus: "idle",
  updateUserError: null,
  addresses: [],
  selectedAddress: null,
  loading: false,

  // AddressState: {
  //   addresses: [],
  //   status: "idle",
  //   error: null,
  // },

  pagination: null,
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
    logout(state) {
      state.login.currentUser = null;
      state.login.token = null;
      state.login.isAuthenticated = false;
      state.login.isLoggedIn = false;
      state.profile.profile = null;
    },
    setProfile(state, action: PayloadAction<UserProfile>) {
      state.profile.profile = action.payload;
      state.profile.roles = action.payload.roles || [];
      state.profile.status = "succeeded";
    },
    setUserList: (state, action: PayloadAction<UserProfile[]>) => {
      state.users = action.payload;
    },
    setDeletedUsers: (state, action: PayloadAction<UserProfile[]>) => {
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
        (state, action: PayloadAction<UserProfile[]>) => {
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

      // .addCase(restoreUserThunk.fulfilled, (state, action) => {
      //   const userId = action.payload;
      //   if (userId) {
      //     state.deletedUsers = state.deletedUsers.filter(
      //       (user) => user._id !== userId
      //     );
      //   } else {
      //     console.error("Ko Hợp lệ . Lỗi");
      //   }
      // })
      // .addCase(restoreUserThunk.rejected, (state, action) => {
      //   state.deletedUsersError =
      //     (action.payload as string) || "An unknown error occurred";
      // })
      .addCase(restoreUserThunk.pending, (state) => {
        state.deletedUsersStatus = "loading";
      })
      .addCase(restoreUserThunk.fulfilled, (state, action) => {
        state.deletedUsersStatus = "succeeded";

        state.deletedUsers = state.deletedUsers.filter(
          (user) => user._id !== action.meta.arg
        );
      })
      .addCase(restoreUserThunk.rejected, (state, action) => {
        state.deletedUsersStatus = "failed";
        state.deletedUsersError = action.payload as string;
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
        state.EmailVerification.error =
          (action.payload as string) || "Đã xảy ra lỗi không xác định";
      })

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
      .addCase(softDeleteUserThunk.pending, (state) => {
        state.activeUsersStatus = "loading";
      })
      .addCase(softDeleteUserThunk.fulfilled, (state, action) => {
        state.activeUsersStatus = "succeeded";

        state.activeUsers = state.activeUsers.filter(
          (user) => user._id !== action.meta.arg
        );
      })
      .addCase(softDeleteUserThunk.rejected, (state, action) => {
        state.activeUsersStatus = "failed";
        state.activeUsersError = action.payload as string;
      })

      // .addCase(getDeletedListThunk.pending, (state) => {
      //   state.deletedUsersStatus = "loading";
      //   state.deletedUsersError = null;
      // })
      // .addCase(
      //   getDeletedListThunk.fulfilled,
      //   (state, action: PayloadAction<any[]>) => {
      //     state.deletedUsersStatus = "succeeded";
      //     state.deletedUsers = action.payload;
      //     state.deletedUsersError = null;
      //   }
      // )
      // .addCase(getDeletedListThunk.rejected, (state, action) => {
      //   state.deletedUsersStatus = "failed";
      //   state.deletedUsersError =
      //     (action.payload as string) || "An unknown error occurred";
      // })
      .addCase(getDeletedListThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getDeletedListThunk.fulfilled,
        (state, action: PayloadAction<LimitCrudUserResponse>) => {
          state.status = "succeeded";
          state.deleyedpagi = action.payload.data.users;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(getDeletedListThunk.rejected, (state, action) => {
        console.error("Error payload:", action.payload);
        state.status = "failed";
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Lỗi không xác định";
      })
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.ForgotPassword.loading = true;
        state.ForgotPassword.status = null;
        state.ForgotPassword.message = null;
        state.ForgotPassword.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state, action) => {
        const { status, message } = action.payload as {
          status: number;
          message: string;
        };
        state.ForgotPassword.loading = false;
        state.ForgotPassword.status = status;
        state.ForgotPassword.message = message;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.ForgotPassword.loading = false;
        state.ForgotPassword.error = action.payload as string;
      })
      .addCase(resetPasswordThunk.pending, (state) => {
        state.ForgotPassword.loading = true;
        state.ForgotPassword.status = null;
        state.ForgotPassword.message = null;
        state.ForgotPassword.error = null; // Xóa kiểm tra null và trực tiếp cập nhật trạng thái
      })
      .addCase(resetPasswordThunk.fulfilled, (state, action) => {
        const { status, message } = action.payload as {
          status: number;
          message: string;
        };
        state.ForgotPassword.loading = false;
        state.ForgotPassword.status = status;
        state.ForgotPassword.message = message;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.ForgotPassword.loading = false;
        state.ForgotPassword.error = action.payload as string;
      })

      .addCase(resendEmailThunk.pending, (state) => {
        state.resendEmail.status = "pending";
        state.resendEmail.message = "";
        state.resendEmail.error = "";
      })
      .addCase(
        resendEmailThunk.fulfilled,
        (state, action: PayloadAction<{ message: string }>) => {
          state.resendEmail.status = "succeeded";
          state.resendEmail.message = action.payload.message;
          state.resendEmail.error = "";
        }
      )
      .addCase(resendEmailThunk.rejected, (state, action) => {
        state.resendEmail.status = "failed";
        state.resendEmail.error =
          (action.payload as string) || "An unknown error occurred";
      })
      .addCase(fetchUserById.pending, (state) => {
        state.fetchUser.status = "loading";
      })
      .addCase(
        fetchUserById.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.fetchUser.status = "succeeded";
          state.fetchUser.user = action.payload;
          state.fetchUser.error = null;
        }
      )
      .addCase(fetchUserById.rejected, (state, action) => {
        state.fetchUser.status = "failed";
        state.fetchUser.error = action.payload as string;
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.fetchUser.status = "loading";
      })
      .addCase(
        updateUserThunk.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.fetchUser.status = "succeeded";
          state.fetchUser.user = action.payload;
          state.fetchUser.error = null;
        }
      )
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.fetchUser.status = "failed";
        state.fetchUser.error = action.payload as string;
      })
      .addCase(getlistRoleThunk.pending, (state) => {
        if (state.role) {
          state.role.status = "loading";
          state.role.error = null;
        }
      })
      .addCase(
        getlistRoleThunk.fulfilled,
        (state, action: PayloadAction<Role[]>) => {
          if (state.role) {
            state.role.status = "succeeded";
            state.role.roles = action.payload;
          }
        }
      )
      .addCase(getlistRoleThunk.rejected, (state, action) => {
        if (state.role) {
          state.role.status = "failed";
          state.role.error = action.payload as string;
        }
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.login.isFetching = false;
        state.login.currentUser = null;
        state.login.token = null;
        state.login.isAuthenticated = false;
        state.login.isLoggedIn = false;
        state.profile.profile = null;
        state.profile.roles = null;
      })

      .addCase(logoutThunk.rejected, (state, action) => {
        state.login.isFetching = false;
        state.login.error = action.payload as string;
      })
      .addCase(loginUserThunk.pending, (state) => {
        state.login.isFetching = true;
        state.login.error = null;
      })
      .addCase(
        loginUserThunk.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.login.isFetching = false;
          state.login.currentUser = action.payload.currentUser;
          state.login.token = action.payload.token ?? null;
          state.login.isAuthenticated = true;

          state.login.isLoggedIn = true;
          state.login.error = null;
        }
      )
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.login.isFetching = false;
        state.login.error = action.payload as string;
        state.login.isAuthenticated = false;
        state.login.isLoggedIn = false;
      })
      .addCase(apiLoginSuccessThunk.pending, (state) => {
        state.login.isFetching = true;
        state.login.error = null;
      })
      .addCase(
        apiLoginSuccessThunk.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.login.isFetching = false;
          state.login.currentUser = action.payload.currentUser;
          state.login.token = action.payload.token ?? null;
          state.login.isAuthenticated = true;
          state.login.isLoggedIn = true;
          state.login.error = null;
          state.login.roles = action.payload.roles;
        }
      )
      .addCase(apiLoginSuccessThunk.rejected, (state, action) => {
        state.login.isFetching = false;
        state.login.error = action.payload as string;
        state.login.isAuthenticated = false;
        state.login.isLoggedIn = false;
      })
      .addCase(fetchAddressListThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchAddressListThunk.fulfilled,
        (state, action: PayloadAction<AddressResponse>) => {
          state.loading = false;
          state.addresses = action.payload.addresses;
        }
      )

      .addCase(fetchAddressListThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Lưu lỗi vào state
      })
      .addCase(fetchAddressByIdThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchAddressByIdThunk.fulfilled,
        (state, action: PayloadAction<Address>) => {
          state.status = "succeeded";
          state.selectedAddress = action.payload;
        }
      )
      .addCase(fetchAddressByIdThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string; // Ghi nhận lỗi
      })
      .addCase(deleteAddressThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteAddressThunk.fulfilled, (state, action) => {
        state.status = "succeeded";

        const addressId = action.meta.arg;

        state.addresses = state.addresses.filter(
          (address) => address._id !== addressId
        );
      })

      .addCase(deleteAddressThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(setDefaultAddressThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(setDefaultAddressThunk.fulfilled, (state, action) => {
        const updatedAddressId = action.meta.arg;

        state.addresses = state.addresses.map((address) => ({
          ...address,
          isDefault: address._id === updatedAddressId,
        }));
      })

      .addCase(setDefaultAddressThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // .addCase(addAddressThunk.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(
      //   addAddressThunk.fulfilled,
      //   (state, action: PayloadAction<Address>) => {
      //     state.loading = false;
      //     state.addresses.push(action.payload);
      //     state.error = null;
      //   }
      // )
      // .addCase(addAddressThunk.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error =
      //     (action.payload as string) || "Có lỗi xảy ra khi thêm địa chỉ";
      // });
      .addCase(addAddressThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addAddressThunk.fulfilled,
        (state, action: PayloadAction<Address>) => {
          state.loading = false;
          state.addresses.push(action.payload); // Thêm địa chỉ mới vào cuối danh sách
          state.error = null;
        }
      )

      .addCase(addAddressThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Có lỗi xảy ra khi thêm địa chỉ";
      })

      // Cập nhật địa chỉ
      .addCase(editAddressThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editAddressThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload.addresses;
      })
      .addCase(editAddressThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // // Xóa địa chỉ
      // .addCase(deleteAddressThunk.pending, (state) => {
      //   state.AddressState.loading = true;
      //   state.error = null;
      // })
      // .addCase(deleteAddressThunk.fulfilled, (state, action) => {
      //   state.AddressState.loading = false;
      //   state.AddressState.addresses = action.payload.addresses;
      // })
      // .addCase(deleteAddressThunk.rejected, (state, action) => {
      //   state.AddressState.loading = false;
      //   state.error = action.payload as string;
      // });
      .addCase(fetchPaginatedUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchPaginatedUser.fulfilled,
        (state, action: PayloadAction<LimitCrudUserResponse>) => {
          state.status = "succeeded";
          state.userpagi = action.payload.data.users;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchPaginatedUser.rejected, (state, action) => {
        console.error("Error payload:", action.payload);
        state.status = "failed";
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Lỗi không xác định";
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
