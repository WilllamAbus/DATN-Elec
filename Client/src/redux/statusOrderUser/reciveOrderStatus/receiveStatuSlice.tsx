// slices/orderSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderDataRecive } from '../../../types/iterationOrder/reciveStatusOrder';
import {  statusReceveThunk} from './receveStatusThunk';

interface OrderState {
  orderReceve: OrderDataRecive[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orderReceve: null,
  loading: false,
  error: null,
};

const receiveOrderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(statusReceveThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(statusReceveThunk.fulfilled, (state, action: PayloadAction<OrderDataRecive[]>) => {
        state.loading = false;
        state.orderReceve = action.payload ;
      })
      .addCase(statusReceveThunk.rejected, (state, action) => {
        state.loading = false;
        // Xử lý khi `action.payload` có thể là `undefined`
        state.error = action.payload as string;
      });
  },
});

export default receiveOrderSlice.reducer;
