// slices/orderSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderDataComplte } from '../../../types/iterationOrder/completeStatusOrder';
import {  statusCompletThunk} from './completeOrderThunk';

interface OrderState {
  orderComplet: OrderDataComplte[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orderComplet: null,
  loading: false,
  error: null,
};

const receiveOrderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(statusCompletThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(statusCompletThunk.fulfilled, (state, action: PayloadAction<OrderDataComplte[]>) => {
        state.loading = false;
        state.orderComplet = action.payload;
      })
      .addCase(statusCompletThunk.rejected, (state, action) => {
        state.loading = false;
        // Xử lý khi `action.payload` có thể là `undefined`
        state.error = action.payload as string;
      });
  },
});

export default receiveOrderSlice.reducer;
