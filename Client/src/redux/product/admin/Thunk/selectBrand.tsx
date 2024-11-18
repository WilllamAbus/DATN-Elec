import { createAsyncThunk } from '@reduxjs/toolkit';
import { selectBrand } from '../../../../services/product_v2/admin/selects/selectBrand';
import { SelectBrandResponse } from '../../../../services/product_v2/admin/types/select/brand';

export const selectBrandThunk = createAsyncThunk<SelectBrandResponse, void, { rejectValue: string }>(
  'brands/select',
  async (_, { rejectWithValue }) => {
    try {
      const response = await selectBrand();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi không xác định');
    }
  }
);
