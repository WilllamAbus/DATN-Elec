// src/redux/checkout/checkoutThunk.ts

import {  createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDeletedOrderAuc, restoreOrder } from '../../../services/orderAuction/getDeletedAdmin'; // Adjust path as necessary
import { OrdersResponse, } from '../../../types/adminOrder/getDeletedOrder';
import {OrderRestore} from '../../../types/adminOrder/restoreOrderAucAdmin'
export const getOrderDeletedThunk = createAsyncThunk<
  OrdersResponse,
  { page?: number; limit?: number },
  { rejectValue: string }
>('orders/getOrders', async ({ page = 1, limit = 5 }, { rejectWithValue }) => {
  try {
    const response = await fetchDeletedOrderAuc({ page, limit });
    console.log('API response:', response);

    if (!response || !response.data || !response.pagination) {
      throw new Error('Invalid response structure');
    }
    
    return response as OrdersResponse;
  } catch (error: any) {
    console.error('Fetch error:', error);
    return rejectWithValue(error.message || 'An error occurred');
  }
});

export const restoreOrderThunk = createAsyncThunk<OrderRestore, string>(
  "orders/restoreOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await restoreOrder(orderId);
      console.log('response', response);
      
      return response.data; // Return the order data
    } catch (error: any) {
      return rejectWithValue(error.response.data); // Handle errors appropriately
    }
  }
);