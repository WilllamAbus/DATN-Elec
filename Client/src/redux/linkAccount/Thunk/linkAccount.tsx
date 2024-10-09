import { createAsyncThunk } from "@reduxjs/toolkit";
import { linkAccountAPI } from "../../../services/link-account/linkAccountAPI";
import { LoginResponse, LinkAccountData } from "../../../types/user";

export const linkAccountThunk = createAsyncThunk<
  LoginResponse,
  LinkAccountData & { token: string },
  { rejectValue: string }
>(
  "auth/linkAccount",
  async (data, { rejectWithValue }) => {
    try {
      const response = await linkAccountAPI(data);
      console.log('API Response:', response);

      if (!response.accessToken) {
        throw new Error("Access token is null or undefined");
      }

      return {
        currentUser: response.currentUser,
        token: response.accessToken,
        roles: response.roles,
        googleId: response.googleId,
        email: response.email,
      } as LoginResponse;
    } catch (error: any) {
      console.error("Error in linkAccountThunk:", error);
      return rejectWithValue(error.message || "An unknown error occurred");
    }
  }
);
