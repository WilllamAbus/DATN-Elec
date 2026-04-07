import { createAsyncThunk } from '@reduxjs/toolkit';
import { restoreProduct } from '../../../../services/product_v2/admin'; 
import { RestoreResponse } from '../types/restore';

export const restoreThunk = createAsyncThunk<RestoreResponse, string, { rejectValue: RestoreResponse }>(
  'products/restore',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await restoreProduct(id);
      if (response.success) {
        return response; 
      } else {
        return rejectWithValue({
          success: response.success,
          err: response.err,
          msg: response.msg,
          status: response.status,
          data: undefined,
          error: response.error 
        });
      }
    } catch (error: any) {
      return rejectWithValue({
        success: false,
        err: 1,
        msg: error.message || 'Lỗi không xác định',
        status: 500,
        data: undefined,
        error: error.message
      });
    }
  }
);
