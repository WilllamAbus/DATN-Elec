// import axios from "axios";
// import { loginFailed, loginStart, loginSuccess } from "./authSlice";
// import { AppDispatch } from "../store";
import {
  registerApi,
  updateProfile,
} from "../../services/authentication/auth.services";
import { UserProfile } from "../../types/user";
import { createAsyncThunk } from "@reduxjs/toolkit";
// const API_URL = import.meta.env.VITE_API_URL;

interface RegisterParams {
  email: string;
  password: string;
  name: string;
}

export const register = createAsyncThunk<
  UserProfile, // Loại dữ liệu trả về từ API
  RegisterParams // Loại dữ liệu đầu vào
>("auth/register", async ({ email, password, name }, { rejectWithValue }) => {
  try {
    const response = await registerApi({ email, password, name });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Đã xảy ra lỗi không xác định");
  }
});
// export const fetchProfile = createAsyncThunk<UserProfile, void>(
//   "auth/fetchProfile",
//   async (_, { rejectWithValue }) => {
//     try {
//       const profile = await getProfile();
//       return profile;
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         return rejectWithValue(
//           error.response?.data?.msg || "Đã xảy ra lỗi không xác định"
//         );
//       }
//       return rejectWithValue("Đã xảy ra lỗi không xác định");
//     }
//   }
// );
export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData: UserProfile, { rejectWithValue }) => {
    try {
      const updatedProfile = await updateProfile(profileData);
      return updatedProfile;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);
