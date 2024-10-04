import { createSlice } from '@reduxjs/toolkit';
import {Order  } from '../../../types/adminOrder/orderAll';
import { softDelAdminThunk } from './softDelAdminThunk';
import {  } from '../../../types/iterationOrder/shippingStatusOrder'; 
interface OrderState {
  softDelorder: Order[];

  delOrderSoft: Order | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: OrderState = {
  softDelorder: [],

  delOrderSoft: null, // Thay đ��i kiểu đúng,
  loading: false,
  error: null,
  successMessage: null
};

const softDetlaeOrderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Các reducers thông thường nếu cần (tùy chọn)
    // resetState có thể dùng để reset trạng thái về initialState
    resetState: (state) => {
      state.softDelorder = [];
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(softDelAdminThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(softDelAdminThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.delOrderSoft = action.payload; // Thay đ��i kiểu đúng,
        // Kiểm tra softDelorder trước khi gọi filter
        // state.shippingStatus = state.shippingStatus.filter((order) => order._id !== action.payload._id);
    
        
        state.softDelorder = [...state.softDelorder, action.payload];
        state.successMessage = "Xóa đơn hàng thành công";
      })
      .addCase(softDelAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default softDetlaeOrderSlice.reducer;