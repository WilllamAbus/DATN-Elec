import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { selectDiscountThunk } from '../Thunk';
import { SelectDiscountResponse, Discount } from '../../../../services/product_v2/admin/types/select/discount';

interface DiscountState {
  discounts: Discount[];
  status: 'idle' | 'loading' | 'success' | 'fail';
  error: string | null;
}

const initialState: DiscountState = {
  discounts: [],
  status: 'idle',
  error: null,
};

const selectDiscountSlice = createSlice({
  name: 'discount/select',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(selectDiscountThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(selectDiscountThunk.fulfilled, (state, action: PayloadAction<SelectDiscountResponse>) => {
        state.status = 'success';
        state.discounts = action.payload.selectDiscounts;  
      })
      .addCase(selectDiscountThunk.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'fail';
        state.error = action.payload || 'Lỗi không xác định';
      });
  },
});

export default selectDiscountSlice.reducer;
