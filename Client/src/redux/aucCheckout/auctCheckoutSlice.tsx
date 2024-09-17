// redux/slices/auctionSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { fetchAuction } from './auctCheckoutThunk';
import { AuctionData } from '../../types/auctions/auctCheckout';

interface AuctionState {
  auctionData: AuctionData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuctionState = {
  auctionData: null,
  loading: false,
  error: null,
};

const auctionSlice = createSlice({
  name: 'auction',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuction.fulfilled, (state, action) => {
        state.loading = false;
        state.auctionData = action.payload;
      })
      .addCase(fetchAuction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch auction data';
      });
  },
});

export default auctionSlice.reducer;
