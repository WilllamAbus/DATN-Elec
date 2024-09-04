import { createAsyncThunk } from '@reduxjs/toolkit';
import { hardDeleteProduct } from '../../../../services/product_v2/admin'; 
import { HardDeleteResponse } from '../types/hardDelete';

export const hardDeleteThunk = createAsyncThunk<HardDeleteResponse, string, { rejectValue: HardDeleteResponse }>(
  'products/hardDelete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await hardDeleteProduct(id);
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
