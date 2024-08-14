import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUser as loginUserService,
  getProfile as getProfileService,
  getList as getListService,
  logout as logoutService,
  updateProfile as updateProfileService,
  registerUser as registerUserService,
  updatePassword as updatePasswordService,
  verifyEmail as verifyEmailService,
  forgotPassword,
  resetPassword,
  resendEmail,
} from "../../services/authentication/auth.services";

import {
  listDeleted,
  restore,
  softDeleteUser,
  updateUser,
  listActive,
  getUserById,
  listRole,
} from "../../services/authentication/authAdmin";
import { UserProfile } from "../../types/user";
interface LoginResponse {
  status: number;
  message: string;
  token?: string;
}

// Thunk cho việc đăng nhập
// export const loginUserThunk = createAsyncThunk(
//   "auth/login",
//   async (user: { email: string; password: string }, { rejectWithValue }) => {
//     try {
//       const response = await loginUserService(user);
//       return response;
//     } catch (error) {
//       if (error instanceof Error) {
//         return rejectWithValue((error as { message: string }).message);
//       }
//     }
//   }
// );
export const loginUserThunk = createAsyncThunk<
  LoginResponse,
  { email: string; password: string }
>("auth/login", async (user, { rejectWithValue }) => {
  try {
    const response = await loginUserService(user);
    return response as LoginResponse;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue((error as { message: string }).message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

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
// export const registerUserThunk = createAsyncThunk(
//   "auth/registerUser",
//   async (
//     user: { email: string; password: string; name: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const result = await registerUserService(user);
//       return result;
//     } catch (error) {
//       return rejectWithValue((error as Error).message);
//     }
//   }
// );
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
      if (error instanceof Error) {
        return rejectWithValue((error as { message: string }).message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// xac thuc email
// export const verifyEmailThunk = createAsyncThunk(
//   "auth/verifyEmail",
//   async (token: string) => {
//     const response = await verifyEmailService(token);
//     return response.message;
//   }
// );
export const verifyEmailThunk = createAsyncThunk(
  "auth/verifyEmail",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await verifyEmailService(token);
      return response.message;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await forgotPassword(email);
      console.log(response);
      return response.message;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

//yêu cầu lại email
export const resendEmailThunk = createAsyncThunk(
  "auth/resendEmail",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await resendEmail(email);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
export const resetPasswordThunk = createAsyncThunk(
  "auth/resetPassword",
  async (
    { token, password }: { token: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await resetPassword(token, password);
      console.log(response);
      return response.message;
    } catch (error) {
      return rejectWithValue(error);
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

///////////////////////////////////////////////////////////////////////ADMIN////////////////////////////////////////////////
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
      console.log(result);
      return result;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

//Lấy danh sách tk là active
// Thunk để lấy danh sách người dùng đã bị xóa mềm
export const getActiveListThunk = createAsyncThunk(
  "auth/getActiveList",
  async (_, { rejectWithValue }) => {
    try {
      const result = await listActive(); // Giả sử listActive là hàm gọi API
      console.log(result);
      return result; // Giả sử kết quả trả về có cấu trúc { data: User[] }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

//Thunk list role
export const getlistRoleThunk = createAsyncThunk(
  "auth/getlistRole",
  async (_, { rejectWithValue }) => {
    try {
      const result = await listRole();
      console.log(result);
      return result;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
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
export const updateUserThunk = createAsyncThunk<
  UserProfile,
  { userId: string; formData: FormData },
  { rejectValue: string }
>("auth/updateUser", async ({ userId, formData }, { rejectWithValue }) => {
  try {
    const result = await updateUser(userId, formData);
    return result;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (userId: string, { rejectWithValue }) => {
    try {
      const user = await getUserById(userId);
      return user;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
