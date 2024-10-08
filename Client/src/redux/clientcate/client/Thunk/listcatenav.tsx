
import { createAsyncThunk } from '@reduxjs/toolkit';
import { listNavCateItem } from '../../../../services/clientcate/client/navbar'; 
import { ListNavItemResponse } from '../types/listcatenav'; 

export const listCateNavItemThunk = createAsyncThunk<ListNavItemResponse, void, { rejectValue: string }>(
  'navItems/listNavItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await listNavCateItem();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi không xác định');
    }
  }
);
