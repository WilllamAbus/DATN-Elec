// slices/biddingSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BiddingState, AuctionResult } from '../../types/deleteBid/deleteBid';
import { deleteBiddingThunk } from './deleteBidThunk';

// Define the initial state based on BiddingState
const initialState: BiddingState = {
  auction: null,
  loading: false,
  error: null,
};

// Create the slice for bidding
const biddingSlice = createSlice({
  name: 'bidding',
  initialState,
  reducers: {
    // Optionally define other synchronous actions
  },
  extraReducers: (builder) => {
    // Handle the deleteBiddingThunk actions
    builder
      .addCase(deleteBiddingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBiddingThunk.fulfilled, (state, action: PayloadAction<AuctionResult>) => {
        state.loading = false;
        state.auction = action.payload;
      })
      .addCase(deleteBiddingThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default biddingSlice.reducer;
