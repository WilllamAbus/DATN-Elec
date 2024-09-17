// src/redux/thunks/orderAuctionThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAuctionData, completeOrder } from '../../services/auction/confirmOrder';
import { OrderAuctionResponse, OrderCompleteResponse } from '../../types/auctions/confirmOrder';

export const getOrderAuctionDetails = createAsyncThunk(
  'orderAuction/getOrderDetails',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response: OrderAuctionResponse = await fetchAuctionData(orderId);
      console.log('responese', response);
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);



export const completOrder = createAsyncThunk<OrderCompleteResponse, string>(
  'confirmOrder/getOrderAuctionDetails',
  async (orderId: string) => {
    return await completeOrder(orderId);
  }
);

