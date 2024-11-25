import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addToWatchlistThunk,
  getWatchlistThunk,
  deleteWatchlistThunk,
} from "./wathlist";
import { WatchlistItem } from "../../../types/cart/profile/wathlist";

interface WatchlistState {
  items: WatchlistItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: WatchlistState = {
  items: [],
  status: "idle",
  error: null,
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWatchlistThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        getWatchlistThunk.fulfilled,
        (state, action: PayloadAction<WatchlistItem[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(
        getWatchlistThunk.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "Failed to fetch watchlist";
        }
      )
      .addCase(addToWatchlistThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        addToWatchlistThunk.fulfilled,
        (state, action: PayloadAction<WatchlistItem>) => {
          state.status = "succeeded";
          state.items.push(action.payload);
        }
      )
      .addCase(
        addToWatchlistThunk.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "Failed to add to watchlist";
        }
      )
      .addCase(deleteWatchlistThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        deleteWatchlistThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";

          state.items = state.items.filter(
            (item) => item.product && item.product._id !== action.payload
          );
        }
      )

      .addCase(
        deleteWatchlistThunk.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "Failed to remove from watchlist";
        }
      );
  },
});

export default watchlistSlice.reducer;
