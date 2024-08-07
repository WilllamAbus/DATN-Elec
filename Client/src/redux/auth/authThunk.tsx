import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUser as loginUserService,
  getProfile as getProfileService,
  getList as getListService,
  logout as logoutService,
  updateProfile as updateProfileService,
  registerUser as registerUserService,
  updatePassword as updatePasswordService,
  verifyEmailService,
} from "../../services/authentication/auth.services";

import {
  listDeleted,
  restore,
  softDeleteUser,
  updateUser,
} from "../../services/authentication/authAdmin";
import { UserProfile } from "../../types/user";

// Thunk cho việc đăng nhập
export const loginUserThunk = createAsyncThunk(
  "auth/login",
  async (user: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await loginUserService(user);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);
export const getProfileThunk = createAsyncThunk<
  UserProfile,
  void,
  { rejectValue: string }
>("auth/getProfile", async (_, { rejectWithValue }) => {
  try {
    const result = await getProfileService();
    console.log("API result:", result);
    return result;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});
// Thunk cho việc lấy danh sách người dùng
export const getListThunk = createAsyncThunk<
  any[],
  void,
  { rejectValue: string }
>("auth/getList", async (_, { rejectWithValue }) => {
  try {
    const result = await getListService();
    return result;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// Thunk cho việc đăng xuất
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateProfileThunk = createAsyncThunk<
  UserProfile,
  FormData,
  { rejectValue: string }
>("auth/updateProfile", async (formData: FormData, { rejectWithValue }) => {
  try {
    const result = await updateProfileService(formData);
    return result;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// Thunk cho việc đăng ký người dùng
export const registerUserThunk = createAsyncThunk(
  "auth/registerUser",
  async (
    user: { email: string; password: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      const result = await registerUserService(user);
      return result;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
// xac thuc email
export const verifyEmail = createAsyncThunk(
  "emailVerification/verifyEmail",
  async (token: string, { rejectWithValue }) => {
    try {
      const message = await verifyEmailService(token);
      return message;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
// Thunk cho việc cập nhật mật khẩu
export const updatePasswordThunk = createAsyncThunk(
  "auth/updatePassword",
  async (
    passwordData: { currentPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const result = await updatePasswordService(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      return result;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
export { logoutService };

//////////////////ADMIN
export const softDeleteUserThunk = createAsyncThunk(
  "auth/softDeleteUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const result = await softDeleteUser(userId);
      return result;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Thunk để lấy danh sách người dùng đã bị xóa mềm
export const getDeletedListThunk = createAsyncThunk(
  "auth/getDeletedList",
  async (_, { rejectWithValue }) => {
    try {
      const result = await listDeleted();
      return result;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

//Thunk khôi phục đã xóa mềm

// Thunk để khôi phục người dùng
export const restoreUserThunk = createAsyncThunk(
  "auth/restoreUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const result = await restore(userId);
      return result;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

//cập nhật người dùng từ admin
export const updateUserThunk = createAsyncThunk(
  "auth/updateUser",
  async (
    { userId, userData }: { userId: string; userData: any },
    { rejectWithValue }
  ) => {
    try {
      const result = await updateUser(userId, userData);
      return result;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
