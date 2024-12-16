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
  addAddress,
  fetchAddressList,
  deleteAddress,
  setDefaultAddress,
  updateAddress,
  fetchAddressById,
  pagiCrudUser,
  // addAddress,
  // updateAddress,
  // deleteAddress,
} from "../../services/authentication/auth.services";
import { logout } from "./authSlice";
import {
  listDeleted,
  restore,
  softDeleteUser,
  updateUser,
  listActive,
  getUserById,
  listRole,
} from "../../services/authentication/authAdmin";
import {
  Address,
  AddressResponse,
  LimitCrudUserResponse,
  Role,
  UserProfile,
} from "../../types/user";

export const loginUserThunk = createAsyncThunk<
  UserProfile,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (user) => {
  try {
    const response = await loginUserService(user);
    console.log("API Response:", response);
    return response as UserProfile;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Lỗi khi thêmm");
  }
});

export const getProfileThunk = createAsyncThunk<
  UserProfile,
  void,
  { rejectValue: string }
>("auth/getProfile", async (_, { rejectWithValue }) => {
  try {
    const result = await getProfileService();
    return result;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

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

//  đăng xuất
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await logoutService();
      dispatch(logout());
      return true;
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
      return {
        status: response.status,
        message: response.message,
      };
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue({
          status: error.response.status,
          message: error.response.data.message,
        });
      }
      return rejectWithValue({
        status: 500,
        message: "Đã xảy ra lỗi.",
      });
    }
  }
);

//yêu cầu lại email
export const resendEmailThunk = createAsyncThunk(
  "auth/resendEmail",
  async (email: string) => {
    try {
      const response = await resendEmail(email);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Lỗi khi thêmm");
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

export const fetchAddressListThunk = createAsyncThunk<
  AddressResponse,
  void,
  { rejectValue: string }
>("auth/fetchAddressList", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchAddressList();
    console.log(response);

    return response;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// export const setDefaultAddressThunk = createAsyncThunk<
//   AddressResponse,
//   string,
//   { rejectValue: string }
// >("address/setDefault", async (addressId, thunkAPI) => {
//   try {
//     const response = await setDefaultAddress(addressId);
//     return response;
//   } catch (error) {
//     if (error instanceof Error) {
//       return thunkAPI.rejectWithValue(error.message);
//     } else {
//       return thunkAPI.rejectWithValue("An unknown error occurred");
//     }
//   }
// });

export const setDefaultAddressThunk = createAsyncThunk(
  "auth/setDefaultAddress",
  async (addressId: string, { rejectWithValue }) => {
    try {
      const response = await setDefaultAddress(addressId);
      return response;
    } catch (error) {
      const errorMessage =
        (error as any).response?.data?.message ||
        "Đã xảy ra lỗi. Vui lòng thử lại.";
      return rejectWithValue(errorMessage);
    }
  }
);

// export const deleteAddressThunk = createAsyncThunk<
//   AddressResponse, // Định nghĩa kiểu trả về
//   { _id: string }, // Định nghĩa kiểu tham số đầu vào
//   { rejectValue: string } // Định nghĩa kiểu giá trị lỗi
// >("watchlist/deleteAddress", async ({ _id }, thunkAPI) => {
//   try {
//     const response = await deleteAddress(_id);
//     return response; // Trả về toàn bộ response từ API
//   } catch (error) {
//     if (error instanceof Error) {
//       return thunkAPI.rejectWithValue(error.message); // Trả về thông báo lỗi
//     } else {
//       return thunkAPI.rejectWithValue("An unknown error occurred"); // Thông báo lỗi mặc định
//     }
//   }
// });
export const deleteAddressThunk = createAsyncThunk(
  "auth/deleteAddress",
  async (_id: string, { rejectWithValue }) => {
    try {
      const response = await deleteAddress(_id);
      return response;
    } catch (error) {
      const errorMessage =
        (error as any).response?.data?.message ||
        "Đã xảy ra lỗi. Vui lòng thử lại.";
      return rejectWithValue(errorMessage);
    }
  }
);

// export const fetchAddressListThunk = createAsyncThunk<
//   AddressResponse, // Thay đổi kiểu trả về
//   void,
//   { rejectValue: string }
// >("auth/fetchAddressList", async (_, thunkAPI) => {
//   try {
//     const response = await fetchAddressList(); // Gọi API để lấy danh sách địa chỉ
//     console.log("danh sách address", response);

//     return response; // Trả về dữ liệu theo kiểu AddressResponse
//   } catch (error) {
//     if (error instanceof Error) {
//       return thunkAPI.rejectWithValue(error.message);
//     } else {
//       return thunkAPI.rejectWithValue("An unknown error occurred");
//     }
//   }
// });
// Cập nhật địa chỉ

export const editAddressThunk = createAsyncThunk(
  "address/edit",
  async ({ addressData }: { addressData: Address }, { rejectWithValue }) => {
    try {
      const response = await updateAddress(addressData);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
export const fetchAddressByIdThunk = createAsyncThunk(
  "address/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response: { address: Address } = await fetchAddressById(id);
      return response.address;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
// // Thêm địa chỉ
export const addAddressThunk = createAsyncThunk(
  "auth/addAddress",
  async (addressData: Address, { rejectWithValue }) => {
    try {
      const response = await addAddress(addressData);
      console.log(response);

      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
// Xóa địa chỉ
// export const deleteAddressThunk = createAsyncThunk(
//   "address/deleteAddress",
//   async (index: number, { rejectWithValue }) => {
//     try {
//       const response = await deleteAddress(index);
//       return response.user;
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
///////////////////////////////////////////////////////////////////////ADMIN////////////////////////////////////////////////
export const softDeleteUserThunk = createAsyncThunk(
  "auth/softDeleteUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await softDeleteUser(userId);
      return response;
    } catch (error) {
      const errorMessage =
        (error as any).response?.data?.message ||
        "Đã xảy ra lỗi. Vui lòng thử lại.";
      return rejectWithValue(errorMessage);
    }
  }
);
export const restoreUserThunk = createAsyncThunk(
  "auth/restoreUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await restore(userId);
      return response;
    } catch (error) {
      const errorMessage =
        (error as any).response?.data?.message ||
        "Đã xảy ra lỗi. Vui lòng thử lại.";
      return rejectWithValue(errorMessage);
    }
  }
);
// Thunk để lấy danh sách người dùng đã bị xóa mềm
// export const getDeletedListThunk = createAsyncThunk(
//   "auth/getDeletedList",
//   async (_, { rejectWithValue }) => {
//     try {
//       const result = await listDeleted();
//       console.log(result);
//       return result;
//     } catch (error) {
//       return rejectWithValue((error as Error).message);
//     }
//   }
// );
export const getDeletedListThunk = createAsyncThunk<
  LimitCrudUserResponse,
  { page: number; search?: string },
  { rejectValue: string }
>("users/DeletedList", async ({ page, search }, { rejectWithValue }) => {
  try {
    const response = await listDeleted(page, search);
    if (response.success) {
      return response;
    } else {
      return rejectWithValue(response.msg);
    }
  } catch (error: any) {
    return rejectWithValue(error.message || "Lỗi không xác định");
  }
});

//Lấy danh sách tk là active

export const getActiveListThunk = createAsyncThunk(
  "auth/getActiveList",
  async (_, { rejectWithValue }) => {
    try {
      const result = await listActive();
      console.log(result);
      return result;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

//Thunk list role
export const getlistRoleThunk = createAsyncThunk<Role[], void>(
  "auth/getlistRole",
  async (_, { rejectWithValue }) => {
    try {
      const result = await listRole();
      console.log(result);
      return result;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Lỗi khi lấy danh sách role.";
      return rejectWithValue(errorMessage);
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
export const fetchPaginatedUser = createAsyncThunk<
  LimitCrudUserResponse,
  { page: number; search?: string },
  { rejectValue: string }
>("users/fetchPaginated", async ({ page, search }, { rejectWithValue }) => {
  try {
    const response = await pagiCrudUser(page, search);
    if (response.success) {
      return response;
    } else {
      return rejectWithValue(response.msg);
    }
  } catch (error: any) {
    return rejectWithValue(error.message || "Lỗi không xác định");
  }
});
