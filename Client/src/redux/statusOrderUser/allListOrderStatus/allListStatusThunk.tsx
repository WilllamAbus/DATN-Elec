// thunks/orderThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchListData } from '../../../services/statusOrders/statusOrder';


export const allListThunk = createAsyncThunk(
  'order/fetchOrderData',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetchListData(userId); // Fetch the data

      // Check and log the structure of response
     
  
      
      // Return response directly if it matches the expected type
      return response.data;
    } catch (error) {
      console.error('Error in thunk:', error);
      return rejectWithValue('Failed to fetch order data');
    }
  }
);


  