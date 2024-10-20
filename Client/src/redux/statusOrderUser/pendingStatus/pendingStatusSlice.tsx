// slices/orderSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderDataAllPendding } from '../../../types/iterationOrder/pendingStatusOrder';
import {  fetchOrderDataPendingThunk} from './pendingStatusThunk';

interface OrderState {
  orderPending: OrderDataAllPendding[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
    orderPending: null,
  loading: false,
  error: null,
};

const statuPendingOrderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrders: (state) => {
      state.orderPending = []; // Xóa sạch danh sách đơn hàng
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderDataPendingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
     
      })
      .addCase(fetchOrderDataPendingThunk.fulfilled, (state, action:PayloadAction<OrderDataAllPendding[]> ) => {
        state.loading = false;
        state.orderPending = action.payload // Assign products
      })
      .addCase(fetchOrderDataPendingThunk.rejected, (state, action) => {
        state.loading = false;
        // Xử lý khi `action.payload` có thể là `undefined`
        state.error = action.payload as string;
      });
  },
});

export default statuPendingOrderSlice.reducer;