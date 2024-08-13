// src/thunks/orderThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { OrderData } from '../../types/Checkout.d';
import { addOrder, 
  getAllOrders , 
  deleteOrderById,
   getOrderById,
   deleteListOrder,
sofDeleteOrder,
ApiResponse,
restore} from '../../services/checkout/checkout.service';

// Define a thunk for adding an order
export const addOrderThunk = createAsyncThunk<OrderData, OrderData>(
    'orders/addOrder',
    async (orderData) => {
      const response = await addOrder(orderData);
      return response; // Ensure response is of type OrderData
    }
  );


  export const fetchAllOrdersThunk = createAsyncThunk<OrderData[]>(
    'orders/fetchAllOrders',
    async (_, thunkAPI) => {
        try {
            const orders = await getAllOrders();
            return orders;
        } catch (error) {
            return thunkAPI.rejectWithValue((error as Error).message);
        }
    }
);

export const fetchOrderById = createAsyncThunk(
    'order/fetchOrderById',
    async (id: string) => {
      const response = await getOrderById(id);
      console.log('responese:', response);
      
      return response.order  as OrderData ;
    }
  );
  
  export const removeOrderById = createAsyncThunk(
    'order/removeOrderById',
    async (_id: string) => {
      await deleteOrderById(_id); // Call API to delete the order
      return _id; // Return the ID of the deleted order
    }
  );
  


  // Soft Delete Category Thunk
 // Adjust import path as necessary
  
 export const softDeleteOrderThunk = createAsyncThunk<OrderData, string>(
  'order/softDeleteOrder',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await sofDeleteOrder(orderId);

      // Check if response contains the expected data
      if (!response || !response.softDel) {
        return rejectWithValue('No data received from softDeleteOrder');
      }
      return response.softDel;  // Return the OrderData part of the response
    } catch (error) {
      // Handle any errors that occurred during the API call
      console.error(error);
      return rejectWithValue('Failed to delete order');
    }
  }
);

export const fetchDeletedOrderThunk = createAsyncThunk<OrderData[]>(
  'order/fetchDeletedOrder',
  async () => {
    try {
      const response: ApiResponse = await deleteListOrder();
      console.log("responseSoftDev:", response);
      
      return response.softDel; // Ensure this is Category[]
    } catch (error) {
      console.error('Error fetching categories:', error);
      return []; // Return an empty array on error
    }
  }
);


export const restoreOrderThunk = createAsyncThunk<OrderData, string>(
  'order/restoreOrder',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await restore(orderId);
      if (!response || !response.data) {
        return rejectWithValue('No data received from restoreOrder');
      }
      return response.data; // Return the restored order data
    } catch (error) {
      console.error('Error restoring order:', error);
      return rejectWithValue('Failed to restore order');
    }
  }
);