import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiLoginSuccessService } from "../../services/authentication/loginSuccess.service";
import {
  loginStart,
  loginSuccess,
  loginFailed,
} from "../../redux/auth/googleSlice";

export const apiLoginSuccessThunk = createAsyncThunk(
  "auth/loginSuccess",
  async (
    { id, token }: { id: string; token: string },
    { dispatch, rejectWithValue }
  ) => {
    dispatch(loginStart());
    try {
      const data = await apiLoginSuccessService(id, token);
      dispatch(loginSuccess(data));
      return data;
    } catch (error: any) {
      console.error("Lỗi trong apiLoginSuccessThunk:", error.message);
      dispatch(loginFailed());
      return rejectWithValue(error.message);
    }
  }
);
