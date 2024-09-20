// redux/orderAuction/orderAuctionSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderResponse } from '../../types/auctions/auctCheckout';
import { createOrderThunk } from './orderAuctionThunk';

interface OrderAuctionState {
  orderData: {
    orderAuctionID: string | null;
    orderDetailAuctionID: string | null;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderAuctionState = {
  orderData: null,
  loading: false,
  error: null,
};

const orderAuctionSlice = createSlice({
  name: 'orderAuction',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action: PayloadAction<OrderResponse>) => {
        state.loading = false;
        // Ensure that action.payload has the correct structure
        const { orderAuctionID, orderDetailAuctionID } = action.payload.data;
        state.orderData = { orderAuctionID, orderDetailAuctionID };
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default orderAuctionSlice.reducer;
