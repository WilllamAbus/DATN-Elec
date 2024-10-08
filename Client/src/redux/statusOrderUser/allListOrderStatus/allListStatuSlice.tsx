import { createSlice, PayloadAction} from '@reduxjs/toolkit';
import {  OrderDataAll, } from '../../../types/iterationOrder/allOrderStatus'; // Thay đổi nếu cần
import { allListThunk } from './allListStatusThunk';

interface OrderState {
  order: OrderDataAll[] | null; // Đảm bảo kiểu đúng
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  order:[],

  loading: false,
  error: null,
};

const allListOrderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrders: (state) => {
      state.order = []; // Xóa sạch danh sách đơn hàng
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(allListThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.order = [];
      })
      .addCase(allListThunk.fulfilled, (state, action: PayloadAction<OrderDataAll[]>) => {
        state.loading = false;
  
        state.order = action.payload ; // Assign products
    })
      .addCase(allListThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export const { resetOrders } = allListOrderSlice.actions;
export default allListOrderSlice.reducer;
