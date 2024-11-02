// src/store/slices/auctionSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { completeAuction } from './auctionThunk';
import { AuctionDataComplete } from '../../types/auctions/auctions';

interface AuctionState {
  auction: AuctionDataComplete | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuctionState = {
  auction:null,
  isLoading: false,
  error: null,
};

const auctionSlice = createSlice({
  name: 'auction',
  initialState,
  reducers: {
    resetState: (state) => {
      state.auction = null;
      state.isLoading = false;
      state.error = null;
 
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(completeAuction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeAuction.fulfilled, (state, action: PayloadAction<AuctionDataComplete>) => {
        state.isLoading = false;
        state.auction = action.payload;
      })
      .addCase(completeAuction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});
export const { resetState } = auctionSlice.actions;
export default auctionSlice.reducer;
