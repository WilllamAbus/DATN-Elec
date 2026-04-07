// src/redux/thunks/orderAuctionThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAuctionData, completeOrder, fetchAuctionDataDef } from '../../services/auction/confirmOrder';
import { OrderAuctionResponse, OrderCompleteResponse, OrderAuctionResponseDefault } from '../../types/auctions/confirmOrder';

export const getOrderAuctionDetails = createAsyncThunk(
  'orderAuction/getOrderDetails',
  async (payload: { orderId: string; status: string , vnpayAmou: string, vnpayBankCode: string,
    vnpayOrderInfo: string, vnpPayDate: string, vnpayResponCode:string , vnpTransNo:string}, { rejectWithValue }) => {
    try {
      const { orderId, status, vnpayAmou,vnpayOrderInfo,
        vnpayBankCode,vnpPayDate,vnpayResponCode , vnpTransNo} = payload;
      const response: OrderAuctionResponse = await fetchAuctionData(orderId,
         status,  vnpayAmou,vnpayOrderInfo,vnpayBankCode,
         vnpPayDate,vnpayResponCode, vnpTransNo);

      return response.data; // Return data if successful
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

export const getOrderAuctionDetailsDefault = createAsyncThunk(
  'orderAuction/getOrderDetailsDefault',
  async (payload: { orderIds: string; }, { rejectWithValue }) => {
    try {
      const { orderIds} = payload;
      const response: OrderAuctionResponseDefault = await fetchAuctionDataDef (orderIds
         );

      return response.data; // Return data if successful
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

