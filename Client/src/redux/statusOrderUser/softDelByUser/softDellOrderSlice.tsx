import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SoftDeleteOrderData } from '../../../types/iterationOrder/softDeleteForUser'; // Thay đổi nếu cần
import { softDelThunk } from './softDellOrderThunk';

interface OrderState {
  softDelorder: SoftDeleteOrderData[] | null; // Đảm bảo kiểu đúng
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: OrderState = {
  softDelorder: [],
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
      .addCase(softDelThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(softDelThunk.fulfilled, (state, action: PayloadAction<SoftDeleteOrderData>) => {
        state.loading = false;
        // Kiểm tra softDelorder trước khi gọi filter
        if (state.softDelorder) {
          state.softDelorder = state.softDelorder.filter((order) => order._id !== action.payload._id);
        }
        state.successMessage = "Xóa đơn hàng thành công";
      })
      .addCase(softDelThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default softDetlaeOrderSlice.reducer;