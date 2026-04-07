import { createAsyncThunk } from '@reduxjs/toolkit';
import { selectDiscount } from '../../../../services/product_v2/admin/selects/selectDiscount';
import { SelectDiscountResponse } from '../../../../services/product_v2/admin/types/select/discount';

export const selectDiscountThunk = createAsyncThunk<SelectDiscountResponse, void, { rejectValue: string }>(
  'discount/select',
  async (_, { rejectWithValue }) => {
    try {
      const response = await selectDiscount();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi không xác định');
    }
  }
);
