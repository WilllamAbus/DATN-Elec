import { createAsyncThunk } from '@reduxjs/toolkit';
import { listProduct } from '../../../../services/product_v2/admin';
import { ListProductResponse } from '../types/list';

export const list = createAsyncThunk<ListProductResponse, void, { rejectValue: string }>(
  'products/list',
  async (_, { rejectWithValue }) => {
    try {
      const response = await listProduct();
      if (response.success) {
        return response; 
      } else {
        return rejectWithValue(response.msg); 
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi không xác định'); 
    }
  }
);
