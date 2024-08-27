import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addToWatchlistThunk,
  getWatchlistThunk,
  deleteWatchlistThunk,
} from "./wathlist";

interface WatchlistState {
  wathlist: {
    items: any[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  };
}

const initialState: WatchlistState = {
  wathlist: {
    items: [],
    status: "idle",
    error: null,
  },
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToWatchlistThunk.pending, (state) => {
        state.wathlist.status = "loading";
      })
      .addCase(
        addToWatchlistThunk.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.wathlist.status = "succeeded";
          state.wathlist.items.push(action.payload);
        }
      )
      .addCase(
        addToWatchlistThunk.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.wathlist.status = "failed";
          state.wathlist.error = action.payload || "An error occurred";
        }
      )
      .addCase(getWatchlistThunk.pending, (state) => {
        state.wathlist.status = "loading";
      })
      .addCase(
        getWatchlistThunk.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.wathlist.status = "succeeded";
          state.wathlist.items = action.payload;
        }
      )
      .addCase(
        getWatchlistThunk.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.wathlist.status = "failed";
          state.wathlist.error = action.payload || "An error occurred";
        }
      )
      .addCase(deleteWatchlistThunk.pending, (state) => {
        state.wathlist.status = "loading";
      })
      .addCase(
        deleteWatchlistThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.wathlist.status = "succeeded";
          state.wathlist.items = state.wathlist.items.filter(
            (item) => item._id !== action.payload
          );
        }
      )
      .addCase(deleteWatchlistThunk.rejected, (state, action) => {
        state.wathlist.status = "failed";
        state.wathlist.error = action.error.message || "An error occurred";
      });
  },
});

export default watchlistSlice.reducer;
