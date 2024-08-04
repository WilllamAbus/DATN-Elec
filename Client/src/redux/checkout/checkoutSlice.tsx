import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderData } from '../../types/Checkout.d';
import { fetchAllOrdersThunk, addOrderThunk, fetchOrderById, removeOrderById } from './checkoutThunk';

export interface OrderState {
  orders: OrderData[];
  currentOrder: OrderData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  status: 'idle',
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchAllOrdersThunk.pending, (state) => {
        state.status = 'loading';
    })
    .addCase(fetchAllOrdersThunk.fulfilled, (state, action: PayloadAction<OrderData[]>) => {
        state.status = 'succeeded';
        state.orders = action.payload;
    })
    .addCase(fetchAllOrdersThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
    })
      .addCase(addOrderThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addOrderThunk.fulfilled, (state, action: PayloadAction<OrderData>) => {
        state.status = 'succeeded';
        state.orders.push(action.payload);
      })
      .addCase(addOrderThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch order';
      })
      .addCase(removeOrderById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeOrderById.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.orders = state.orders.filter((order: OrderData) => order._id !== action.payload); // Ensure proper typing
      })
      .addCase(removeOrderById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete order';
      });
  },
});

export default orderSlice.reducer;
