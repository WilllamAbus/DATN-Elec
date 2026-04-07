import {  createAsyncThunk } from '@reduxjs/toolkit';
import { getAllOrders, fetchOrderDetailAdminData } from '../../../services/orderAuction/getOrderAdmin'; // Adjust path as necessary
import { OrderResponse, } from '../../../types/adminOrder/orderAll';
import { OrderDetailAdminResponse, } from '../../../types/adminOrder/orderDetailAdmin';

interface FetchOrderssParams {
  page: number;
  pageSize: number;
  search?: string;
}
export const getOrders = createAsyncThunk<OrderResponse, FetchOrderssParams>(
  'orders/getOrders',
  async ({ page, pageSize, search = '' }, { rejectWithValue }) => {
  // Fallback to an empty string if search is undefined

    try {
      const response = await getAllOrders(page,pageSize,  search);
      
      // Extract the orders array
   
      return response; // Return only the orders array
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);





export const getOrderAuctionDetailsAdmin = createAsyncThunk(
  'orderAuction/getOrderDetails',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response: OrderDetailAdminResponse = await fetchOrderDetailAdminData(orderId);

      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);