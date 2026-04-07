// src/redux/thunks/timeTrackThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PriceRandService } from '../../../services/adminPriceRand/adminPriceRandAuct';
import { PriceRangeResponseDeleted, PriceRangeRestoreAuct, PriceRangeDelAuct, PriceRangeAuctSoftDel} from '../../../types/adminPriceRandAuct/deletePriceRandAuct';
interface FetchPriceRandParams {
    page: number;
    pageSize: number;
    search?: string;
  }
  
export const fetchPriceRandDeleted = createAsyncThunk<PriceRangeResponseDeleted, FetchPriceRandParams>(
  'prictRandAuctDlted/fetchPriceRandAuctDleted',
  async ({ page, pageSize, search = '' }, { rejectWithValue }) => {
    try {
      const response  = await PriceRandService.deletedPricceRand(page, pageSize, search);
      return response;
    } catch (error) {
      return rejectWithValue('Error fetching time tracks');
    }
  }
);


export const restorePriceRandAdminThunk = createAsyncThunk<PriceRangeRestoreAuct , { id: string }, { rejectValue: string }>(
  'prictRandAuctDlted/restorePriceRandAuctAdmin',
  async ({id}, { rejectWithValue }) => {
    try {
      const response  = await PriceRandService.restorePriceRand(id);

      
      return response.data;
    } catch (error: any) {
      // Trả về thông báo lỗi cụ thể với rejectWithValue
      return rejectWithValue('Failed to fetch order data');
    }
  }
);


export const deletePriceRandAdminThunk = createAsyncThunk<PriceRangeDelAuct , { id: string }, { rejectValue: string }>(
    'prictRandAuctDlted/deletePriceRandAuctAdmin',
    async ({id}, { rejectWithValue }) => {
      try {
        const response  = await PriceRandService.delPriceRand(id);
  
        
        return response.data;
      } catch (error: any) {
        // Trả về thông báo lỗi cụ thể với rejectWithValue
        return rejectWithValue('Failed to fetch order data');
      }
    }
  );


  export const softDelPriceRandAdminThunk = createAsyncThunk<PriceRangeAuctSoftDel , { id: string }, { rejectValue: string }>(
    'prictRandAuctDlted/softDelPrictRadAuct',
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