// thunks/orderThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { shippingStatusOrder } from '../../../services/statusOrders/statusOrder';


export const fetchOrderDataShippingThunk = createAsyncThunk(
    'order/shippingData',
    async (userId: string, { rejectWithValue }) => {
      try {
        const response = await shippingStatusOrder(userId);
        return response.data;
      } catch (error: any) {
        // Trả về thông báo lỗi cụ thể với rejectWithValue
        return rejectWithValue('Failed to fetch order data');
      }
    }
  );
