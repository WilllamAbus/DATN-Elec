// thunks/watchlistThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addToWatchlist,
  getWatchlist,
  DeleteWatchlist,
  CheckWatchlist,
} from "../../../services/authentication/auth.services";
import { LimitCrudWathlistResponse } from "src/types/cart/profile/wathlist";

// interface WatchlistItem {
//   userId: string;
//   productId: string;
// }

export const addToWatchlistThunk = createAsyncThunk<
  any,
  { variantId: string },
  { rejectValue: string }
>("watchlist/addToWatchlist", async ({ variantId }, thunkAPI) => {
  try {
    const response = await addToWatchlist(variantId);
    return response;
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message);
    } else {
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
});
export const CheckWatchlistThunk = createAsyncThunk<
  any[],
  void,
  { rejectValue: string }
>("watchlist/CheckWatchlist", async (_, thunkAPI) => {
  try {
    const response = await CheckWatchlist();
    console.log("danh sách wathlisst", response);

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message);
    } else {
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
});
export const getWatchlistThunk = createAsyncThunk<
  LimitCrudWathlistResponse,
  { page: number; search?: string },
  { rejectValue: string }
>("watchlist/getWatchlist", async ({ page, search }, { rejectWithValue }) => {
  try {
    const response = await getWatchlist(page, search);
    if (response.success) {
      return response;
    } else {
      return rejectWithValue(response.msg);
    }
  } catch (error: any) {
    return rejectWithValue(error.message || "Lỗi không xác định");
  }
});

export const deleteWatchlistThunk = createAsyncThunk<
  any,
  { variantId: string },
  { rejectValue: string }
>("watchlist/deleteWatchlist", async ({ variantId }, thunkAPI) => {
  try {
    const response = await DeleteWatchlist(variantId);
    return response;
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message);
    } else {
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
});
