// thunks/watchlistThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addToWatchlist,
  getWatchlist,
  DeleteWatchlist,
} from "../../../services/authentication/auth.services";

interface WatchlistItem {
  userId: string;
  productId: string;
}

export const addToWatchlistThunk = createAsyncThunk<
  any,
  WatchlistItem,
  { rejectValue: string }
>("watchlist/addToWatchlist", async ({ userId, productId }, thunkAPI) => {
  try {
    const response = await addToWatchlist(userId, productId);
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
  any[],
  void,
  { rejectValue: string }
>("watchlist/getWatchlist", async (_, thunkAPI) => {
  try {
    const response = await getWatchlist();
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

export const deleteWatchlistThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("watchlist/deleteWatchlist", async (productId, thunkAPI) => {
  try {
    await DeleteWatchlist(productId);
    return productId;
  } catch (error) {
    return thunkAPI.rejectWithValue((error as Error).message);
  }
});
