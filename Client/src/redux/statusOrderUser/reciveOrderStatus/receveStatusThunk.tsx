// thunks/orderThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { statusReceve } from '../../../services/statusOrders/statusOrder';


export const statusReceveThunk = createAsyncThunk(
    'order/receiveOrderData',
    async (userId: string, { rejectWithValue }) => {
      try {
        const response = await statusReceve(userId);
        return response.data;
      } catch (error: any) {
        // Trả về thông báo lỗi cụ thể với rejectWithValue
        return rejectWithValue('Failed to fetch order data');
      }
    }
  );