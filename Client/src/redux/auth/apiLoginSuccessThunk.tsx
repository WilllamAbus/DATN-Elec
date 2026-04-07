import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiLoginSuccessService } from "../../services/authentication/loginSuccess.service";
import { LoginResponse } from "../../types/user";
export const apiLoginSuccessThunk = createAsyncThunk<
  LoginResponse,
  { id: string; token: string },
  { rejectValue: string }
>("auth/loginSuccess", async ({ id, token }, { rejectWithValue }) => {
  try {
    const response = await apiLoginSuccessService(id, token);
    if (response.accessToken) {
      return {
        currentUser: response.currentUser,
        token: response.accessToken, 
        roles: response.roles 
      } as LoginResponse;
    } else {
      throw new Error("No access token received");
    }
  } catch (error: any) {
    console.error("Error in apiLoginSuccessThunk:", error);
    return rejectWithValue(error.message || "An unknown error occurred");
  }
});
