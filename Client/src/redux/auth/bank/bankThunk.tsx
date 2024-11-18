import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addBank,
  deleteBanks,
  getBank,
  listBank,
  setDefaultBank,
} from "../../../services/authentication/bank";
import { Bank, BankResponse } from "../../../types/user";

export const getBanks = createAsyncThunk("bank/getlistBanks", async () => {
  const response = await getBank();
  return response.data;
});
export const addBankThunk = createAsyncThunk(
  "bank/addBank",
  async (BankData: Bank) => {
    try {
      const response = await addBank(BankData);
      console.log(response);

      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Lỗi khi thêmm");
    }
  }
);
export const listBankThunk = createAsyncThunk<BankResponse>(
  "bank/listBank",
  async (_, { rejectWithValue }) => {
    try {
      const response = await listBank();
      console.log("API response:", response);

      if (!response || !response.banks) {
        throw new Error("No data returned from the API.");
      }
      return response;
    } catch (error) {
      console.error("Error fetching cart:", error);
      return rejectWithValue((error as Error).message);
    }
  }
);
export const deleteBankThunk = createAsyncThunk(
  "bank/deleteBank",
  async (_id: string, { rejectWithValue }) => {
    try {
      const response = await deleteBanks(_id);
      return response;
    } catch (error) {
      console.error("Error fetching cart:", error);
      return rejectWithValue((error as Error).message);
    }
  }
);
export const setDefaultBankThunk = createAsyncThunk(
  "bank/setDefaultBank",
  async (_id: string, { rejectWithValue }) => {
    try {
      const response = await setDefaultBank(_id);
      return response;
    } catch (error) {
      console.error("Error fetching cart:", error);
      return rejectWithValue((error as Error).message);
    }
  }
);
