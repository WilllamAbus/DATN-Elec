import {  createAsyncThunk } from '@reduxjs/toolkit';
import { getAllAuctEnableAdmin, fetAuctEnableDetailAdminData } from '../../services/adminEnableAuct/enableService'; // Adjust path as necessary
import { EnableAllResponse, } from '../../types/adminEnbaleAuct/allEnableAuct';
import { EnableAuctDetailAdminResponse, } from '../../types/adminEnbaleAuct/detailEnable';

interface FetchEnableCheckParams {
  page: number;
  pageSize: number;
  search?: string;
}
export const getEnableAuctWinner = createAsyncThunk<EnableAllResponse, FetchEnableCheckParams>(
  'enableAuct/getEnableAuctWinner',
  async ({ page, pageSize, search = '' }, { rejectWithValue }) => {
  // Fallback to an empty string if search is undefined

    try {
      const response = await getAllAuctEnableAdmin(page,pageSize,  search);
      
      // Extract the orders array
   
      return response; // Return only the orders array
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);





export const getEnableAuctionDetailsAdmin = createAsyncThunk(
  'enableAuct/getEnableAuctionDetailsAdmin',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response: EnableAuctDetailAdminResponse = await fetAuctEnableDetailAdminData(orderId);

        
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);