// src/thunks/orderThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { OrderData } from '../../types/Checkout.d';
import { addOrder, getAllOrders , deleteOrderById, getOrderById} from '../../services/checkout/checkout.service';

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
  