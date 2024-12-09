// thunks/watchlistThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addToWatchlist,
  getWatchlist,
  DeleteWatchlist,
} from "../../../services/authentication/auth.services";

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
