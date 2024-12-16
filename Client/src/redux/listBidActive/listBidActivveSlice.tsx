// src/redux/slices/timeTrackSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchListBidActive} from './listbidActiveThunk';
import {BiddingActive} from '../../types/listBiddings/listBidActive';
interface biddingState {
    BiddingActive: BiddingActive[];

  totalPages: number;
  currentPage: number;

  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: biddingState = {
    BiddingActive: [],

  totalPages: 1,
  currentPage: 1,

  loading: false,
  error: null,
  successMessage: null
};

const biddingActiveSlice = createSlice({
  name: 'biddingActive',
  initialState,
  reducers: {
    setBiddingActive(state, action: PayloadAction<BiddingActive[]>) {
      state.BiddingActive = action.payload;
    },
    clearUserBidding(state, action: PayloadAction<string>) {
      state.BiddingActive = state.BiddingActive.filter(
        (bid) => bid.biddingUserObj._id !== action.payload
      );
    },
    clearProductBidding(state, action: PayloadAction<string>) {
      state.BiddingActive = state.BiddingActive.filter(
        (bid) => bid.product_bidding.productId !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListBidActive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListBidActive.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.BiddingActive = action.payload.data.biddingActive;
        state.totalPages = action.payload.data.totalPagesActive;
        state.currentPage = action.payload.data.currentPageActive;

    
    
      })
      .addCase(fetchListBidActive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


  
  },
});
export const { setBiddingActive, clearUserBidding , clearProductBidding} = biddingActiveSlice.actions;
export default biddingActiveSlice.reducer;