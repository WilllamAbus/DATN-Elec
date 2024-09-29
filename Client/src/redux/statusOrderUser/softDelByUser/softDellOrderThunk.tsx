// thunks/orderThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { softDelOrderUser } from '../../../services/statusOrders/statusOrder';
import {SoftDeleteOrderResponse  } from '../../../types/iterationOrder/softDeleteForUser';

export const softDelThunk = createAsyncThunk(
    'order/fetchOrderData',
    async (orderId: string, { rejectWithValue }) => {
      try {
        const response:SoftDeleteOrderResponse  = await softDelOrderUser(orderId);
        return response.data;
      } catch (error: any) {
        // Trả về thông báo lỗi cụ thể với rejectWithValue
        return rejectWithValue('Failed to fetch order data');
      }
    }
  );