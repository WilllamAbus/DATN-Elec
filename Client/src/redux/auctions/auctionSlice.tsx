// src/store/slices/auctionSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { completeAuction } from './auctionThunk';
import { AuctionData } from '../../types/auctions/auctions';

interface AuctionState {
  auction: AuctionData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuctionState = {
  auction: null,
  isLoading: false,
  error: null,
};

const auctionSlice = createSlice({
  name: 'auction',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(completeAuction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeAuction.fulfilled, (state, action: PayloadAction<AuctionData>) => {
        state.isLoading = false;
        state.auction = action.payload;
      })
      .addCase(completeAuction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default auctionSlice.reducer;
