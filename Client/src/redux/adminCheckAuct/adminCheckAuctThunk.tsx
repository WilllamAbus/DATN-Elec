import {  createAsyncThunk } from '@reduxjs/toolkit';
import { getAllAuctAdmin, fetAuctWinnerDetailAdminData } from '../../services/adminCheckAuct/adminCheckAuct'; // Adjust path as necessary
import { CheckAuctWinnerResponse, } from '../../types/adminCheckAuctWinner/getAllCheckWinner';
import { WinnerAuctDetailAdminResponse, } from '../../types/adminCheckAuctWinner/detailCheckWinner';

interface FetchWinnerCheckParams {
  page: number;
  pageSize: number;
  search?: string;
}
export const getCheckAuctWinner = createAsyncThunk<CheckAuctWinnerResponse, FetchWinnerCheckParams>(
  'checkWinner/getCheckAuctWinner',
  async ({ page, pageSize, search = '' }, { rejectWithValue }) => {
  // Fallback to an empty string if search is undefined

    try {
      const response = await getAllAuctAdmin(page,pageSize,  search);
      
      // Extract the orders array
   
      return response; // Return only the orders array
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);





export const getWinnerAuctionDetailsAdmin = createAsyncThunk(
  'checkWinner/getWinnerAuctionDetailsAdmin',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response: WinnerAuctDetailAdminResponse = await fetAuctWinnerDetailAdminData(orderId);
        console.log('Fetched', response);
        
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);