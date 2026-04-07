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
  reducers: {
    clearAuctionData(state) {
      state.auctionData = null;
      state.error = null;
      state.loading = false;
    },
    // clearCompletedAuctionCheckout(state, action: PayloadAction<string>) {
    //   const productId = action.payload;
    //   state.auctionData = state.auctionData.filter(
    //     (bid) => bid.product_bidding.productId._id !== productId // Truy cập `_id` của Product
    //   );
    //   state.totalBids = state.bids.length;
    // }
  },
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
export const { clearAuctionData } = auctionSlice.actions;
export default auctionSlice.reducer;
