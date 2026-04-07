import { createAsyncThunk } from '@reduxjs/toolkit';
import { selectProducts } from '../../../../../services/post/admin/select/selectProduct';
import { SelectProductResponse } from '../../../../../services/post/admin/types/selectProduct';

export const selectProductsThunk = createAsyncThunk<SelectProductResponse, void, { rejectValue: string }>(
  'products/select',
  async (_, { rejectWithValue }) => {
    try {
      const response = await selectProducts(); 
      return response; 
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi không xác định'); 
    }
  }
);
