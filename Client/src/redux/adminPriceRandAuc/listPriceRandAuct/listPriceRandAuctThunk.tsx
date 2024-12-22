import { createAsyncThunk } from '@reduxjs/toolkit';
import { PriceRandService } from '../../../services/adminPriceRand/adminPriceRandAuct';
import { PriceRangeResponse, PriceRangeAuctSoftDel } from '../../../types/adminPriceRandAuct/listPriceRandAuct';
// import { PriceRangeSoftDel } from '../../../types/adminPriceRand/softDelPriceRand';
interface FetchPriceRandParams {
  page: number;
  pageSize: number;
  search?: string;
}

export const fetchPriceRand = createAsyncThunk<PriceRangeResponse, FetchPriceRandParams>(
  'prictRadAuct/fetchPrictRadAuct',
  async ({ page, pageSize, search = '' }, { rejectWithValue }) => {
    try {
      const response  = await PriceRandService.getAllPriceRand(page, pageSize, search);
      return response;
    } catch (error) {
      return rejectWithValue('Error fetching time tracks');
    }
  }
);



export const softDelPriceRandAdminThunk = createAsyncThunk<PriceRangeAuctSoftDel , { id: string }, { rejectValue: string }>(
  'prictRadAuct/softDelPrictRadAuct',
  async ({id}, { rejectWithValue }) => {
    try {
      const response  = await PriceRandService.softDelPriceRand(id);
  
      
      return response.data;
    } catch (error: any) {
      // Trả về thông báo lỗi cụ thể với rejectWithValue
      return rejectWithValue('Failed to fetch order data');
    }
  }
);