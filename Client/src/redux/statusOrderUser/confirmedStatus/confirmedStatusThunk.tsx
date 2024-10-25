import { createAsyncThunk } from '@reduxjs/toolkit';
import { confirmedStatusOrder } from '../../../services/statusOrders/statusOrder';


export const fetchOrderDataConfirmThunk = createAsyncThunk(
    'order/shippingData',
    async (userId: string, { rejectWithValue }) => {
      try {
        const response = await confirmedStatusOrder(userId);
        return response.data;
      } catch (error: any) {
        // Trả về thông báo lỗi cụ thể với rejectWithValue
        return rejectWithValue('Failed to fetch order data');
      }
    }
  );