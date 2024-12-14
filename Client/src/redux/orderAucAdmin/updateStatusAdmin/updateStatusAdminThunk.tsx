import {  createAsyncThunk } from '@reduxjs/toolkit';
import { updateOrderStatus, updateOrderStatusCash } from '../../../services/orderAuction/getOrderAdmin'; // Adjust path as necessary
import { Order } from '../../../types/adminOrder/orderUpdateStatus'



export const updateOrderStatusThunk = createAsyncThunk< Order,
{ orderId: string; stateOrder: string },
{ rejectValue: string }>(
  'orderAucAdmin/updateOrderStatus',
  async ( { orderId, stateOrder }, { rejectWithValue }) => {
    try {
      const response = await updateOrderStatus(orderId, stateOrder);

      
      return response; // Return the updated order
    } catch (error) {
      return rejectWithValue('Cập nhật không thành công'); // Return the error message
    }
  }
);


export const updateOrderStatusThunkCash = createAsyncThunk< Order,
{ orderIdCash: string; stateOrderCash: string },
{ rejectValue: string }>(
  'orderAucAdmin/updateOrderStatus',
  async ( { orderIdCash, stateOrderCash }, { rejectWithValue }) => {
    try {
      const response = await updateOrderStatusCash(orderIdCash, stateOrderCash);

      
      return response; // Return the updated order
    } catch (error) {
      return rejectWithValue('Cập nhật không thành công'); // Return the error message
    }
  }
);