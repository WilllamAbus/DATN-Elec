// slices/orderSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderDataAllConfirmed } from '../../../types/iterationOrder/confirmedStatusOrder';
import {  fetchOrderDataConfirmThunk} from './confirmedStatusThunk';

interface OrderState {
  orderConfirmed: OrderDataAllConfirmed[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
    orderConfirmed: null,
  loading: false,
  error: null,
};

const statuConfirmedOrderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrders: (state) => {
      state.orderConfirmed = []; // Xóa sạch danh sách đơn hàng
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderDataConfirmThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
     
      })
      .addCase(fetchOrderDataConfirmThunk.fulfilled, (state, action:PayloadAction<OrderDataAllConfirmed[]> ) => {
        state.loading = false;
        state.orderConfirmed = action.payload // Assign products
      })
      .addCase(fetchOrderDataConfirmThunk.rejected, (state, action) => {
        state.loading = false;
        // Xử lý khi `action.payload` có thể là `undefined`
        state.error = action.payload as string;
      });
  },
});

export default statuConfirmedOrderSlice.reducer;