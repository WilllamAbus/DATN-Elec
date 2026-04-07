import { createAsyncThunk } from '@reduxjs/toolkit';
import { pendingStatusOrder } from '../../../services/statusOrders/statusOrder';


export const fetchOrderDataPendingThunk = createAsyncThunk(
    'order/shippingData',
    async (userId: string, { rejectWithValue }) => {
      try {
        const response = await pendingStatusOrder(userId);
        return response.data;
      } catch (error: any) {
        // Trả về thông báo lỗi cụ thể với rejectWithValue
        return rejectWithValue('Failed to fetch order data');
      }
    }
  );
