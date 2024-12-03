import { createSlice, PayloadAction } from '@reduxjs/toolkit'; // Import PayloadAction
import { getOrderAuctionDetails, completOrder, getOrderAuctionDetailsDefault } from './confirmOrderThunk';
import { OrderAuctionDetail, OrderCompleteResponse, OrderAuctionDetailDefaut } from '../../types/auctions/confirmOrder';

interface OrderAuctionState {

  confirmOrder: OrderAuctionDetail | null;
  confirmOrderDefaut: OrderAuctionDetailDefaut | null;
  completeOrder: OrderCompleteResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderAuctionState = {
  confirmOrder: null,
  confirmOrderDefaut:null,
  completeOrder: null,
  loading: false,
  error: null,
};

const orderAuctionSlice = createSlice({
  name: 'orderAuction',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrderAuctionDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderAuctionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.confirmOrder = action.payload as OrderAuctionDetail;  // Ensure payload is of type OrderAuctionDetail
      })
      .addCase(getOrderAuctionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getOrderAuctionDetailsDefault.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderAuctionDetailsDefault.fulfilled, (state, action) => {
        state.loading = false;
        state.confirmOrderDefaut = action.payload as OrderAuctionDetailDefaut;  // Ensure payload is of type OrderAuctionDetail
      })
      .addCase(getOrderAuctionDetailsDefault.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(completOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completOrder.fulfilled, (state, action: PayloadAction<OrderCompleteResponse>) => {
        state.loading = false;
        state.completeOrder = action.payload;
      })
      .addCase(completOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export default orderAuctionSlice.reducer;
