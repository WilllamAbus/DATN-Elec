// thunks/orderThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { softDelOrderUser } from '../../../services/statusOrders/statusOrder';
import {SoftDeleteOrderData  } from '../../../types/iterationOrder/softDeleteForUser';

export const softDelThunk = createAsyncThunk<SoftDeleteOrderData , { orderId: string }, { rejectValue: string }>(
    'order/fetchOrderData',
    async ({orderId}, { rejectWithValue }) => {
      try {
        const response  = await softDelOrderUser(orderId);
        return response.data;
      } catch (error: any) {
        // Trả về thông báo lỗi cụ thể với rejectWithValue
        return rejectWithValue('Failed to fetch order data');
      }
    }
  );


