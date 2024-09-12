import { createAsyncThunk } from '@reduxjs/toolkit';
import { softDeleteProduct } from '../../../../services/product_v2/admin'; // Đảm bảo đường dẫn chính 
import { SoftDeleteResponse } from '../types/softdelete';

export const softDelete = createAsyncThunk<SoftDeleteResponse, string, { rejectValue: SoftDeleteResponse }>(
  'products/softDelete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await softDeleteProduct(id);
      if (response.success) {
        return response; 
      } else {

        return rejectWithValue({
          success: response.success,
          err: response.err,
          msg: response.msg,
          status: response.status,
          data: null 
        });
      }
    } catch (error: any) {
      return rejectWithValue({
        success: false,
        err: 1,
        msg: error.message || 'Lỗi không xác định',
        status: 500,
        data: null
      });
    }
  }
);
