import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchListBid } from './listBidThunk';
import { Product, Pagination, BiddingHistoryResponse } from '../../types/listBiddings/BiddingList';

interface BiddingState {
  products: Product[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

const initialState: BiddingState = {
  products: [],
  pagination: null,
  loading: false,
  error: null,
};

const biddingSlice = createSlice({
  name: 'bidding',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchListBid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListBid.fulfilled, (state, action: PayloadAction<BiddingHistoryResponse>) => {
        state.loading = false;
        state.products = action.payload.data.products;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchListBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default biddingSlice.reducer;
