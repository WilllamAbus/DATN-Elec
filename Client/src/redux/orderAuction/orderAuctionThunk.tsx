import { createAsyncThunk } from '@reduxjs/toolkit';
import { createOrder } from '../../services/auction/orderAuction';
import { OrderResponse, OrderDataType } from '../../types/auctions/auctCheckout';

export const createOrderThunk = createAsyncThunk<OrderResponse, OrderDataType>(
  'auctCheckout/createOrder',
  async (orderData, thunkAPI) => {
    try {
      // Call the API to create the order
      const response = await createOrder(orderData);
     
        
      // Return the full response if successful
      return response;
    } catch (error) {
      // Log the error for debugging purposes
      console.error('Error in createOrderThunk:', error);

      // Reject the thunk with an error message
      return thunkAPI.rejectWithValue('Không có giá trị trả về');
    }
  }
);


