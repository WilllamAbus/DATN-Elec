import { createAsyncThunk } from '@reduxjs/toolkit';
import { selectSupplier } from '../../../../services/product_v2/admin/selects/selectSupplier';
import { SelectSupplierResponse } from '../../../../services/product_v2/admin/types/select/supplier';

export const selectSupplierThunk = createAsyncThunk<SelectSupplierResponse, void, { rejectValue: string }>(
  'supplier/select',
  async (_, { rejectWithValue }) => {
    try {
      const response = await selectSupplier();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi không xác định');
    }
  }
);
