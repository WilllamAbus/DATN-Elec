// src/redux/checkout/checkoutThunk.ts

import {  createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDeletedOrderAuc, restoreOrder } from '../../../services/orderAuction/getDeletedAdmin'; // Adjust path as necessary
import { OrdersDeletedResponse, } from '../../../types/adminOrder/getDeletedOrder';
import {OrderRestore} from '../../../types/adminOrder/restoreOrderAucAdmin'

interface FetchOrdersDeletedsParams {
  page: number;
  pageSize: number;
  search?: string;
}
export const getOrderDeletedThunk = createAsyncThunk<OrdersDeletedResponse,FetchOrdersDeletedsParams>('orders/getOrders', async ({ page, pageSize, search = '' }, { rejectWithValue }) => {
  try {
    const response = await fetchDeletedOrderAuc(page, pageSize, search);


    
    
    return response ;
  } catch (error: any) {
    console.error('Fetch error:', error);
    return rejectWithValue(error.message || 'An error occurred');
  }
})


;






export const restoreOrderThunk = createAsyncThunk<OrderRestore, string>(
  "orders/restoreOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await restoreOrder(orderId);

      
      return response.data; // Return the order data
    } catch (error: any) {
      return rejectWithValue(error.response.data); // Handle errors appropriately
    }
  }
);