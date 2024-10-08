// thunks/orderThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { statusComplte } from '../../../services/statusOrders/statusOrder';


export const statusCompletThunk = createAsyncThunk(
    'order/receiveOrderData',
    async (userId:string, { rejectWithValue }) => {
      try {
        const response = await statusComplte(userId);
        return response.data;
      } catch (error: any) {
        // Trả về thông báo lỗi cụ thể với rejectWithValue
        return rejectWithValue('Failed to fetch order data');
      }
    }
  );