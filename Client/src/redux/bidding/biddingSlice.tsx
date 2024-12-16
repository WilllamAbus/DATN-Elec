import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BidResponse, BidsState, Bid, UpdateBidData , UpdateBidAmountResponse} from '../../types/bidding/bidding';
import { createBidThunk, fetchBidsByUserThunk, updateBidAmountThunk } from './biddingThunk';

// Define the initial state
interface BidState {
  bidData: BidResponse | null;
  updatedBid: UpdateBidData | null;
  bids: Bid[]; 
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  totalBids: number;
  loading: boolean;
}

const initialState: BidState = {
    updatedBid: null,
  bidData: null,
  status: 'idle',
  error: null,
  totalBids: 0,
  bids: [],
  loading: false,
};

// Create the slice
const bidSlice = createSlice({
  name: 'bids',
  initialState,
  reducers: {/**Test gan mot65 cai restState */
    setBids(state, action: PayloadAction<Bid[]>) {
      state.bids = action.payload;
      state.totalBids = action.payload.length;
    },
    resetStateBidding: (state) => {
      state.updatedBid = null;
      state.bidData = null;
      state.totalBids = 0;
      state.updatedBid = null;
      state.bids = [];
      state.error = null;
 
    },
    clearCompletedAuction(state, action: PayloadAction<string>) {
      const productId = action.payload;
      state.bids = state.bids.filter(
        (bid) => bid.product_bidding.productId._id !== productId // Truy cập `_id` của Product
      );
      state.totalBids = state.bids.length;
    }

  },
  extraReducers: (builder) => {
    builder
      .addCase(createBidThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createBidThunk.fulfilled, (state, action: PayloadAction<BidResponse>) => {
        state.status = 'succeeded';
        state.bidData = action.payload;
        state.error = null;
      })
      .addCase(createBidThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchBidsByUserThunk.fulfilled, (state, action: PayloadAction<BidsState>) => {
        state.totalBids = action.payload.totalBids;
        state.bids = action.payload.bids;
      })
      .addCase(updateBidAmountThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(updateBidAmountThunk.fulfilled, (state, action: PayloadAction<UpdateBidAmountResponse>) => {
        state.loading = false;
        state.updatedBid = action.payload.data;
    })
    .addCase(updateBidAmountThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
    });
  },
});
export const { resetStateBidding,setBids,clearCompletedAuction } = bidSlice.actions;
export default bidSlice.reducer;
