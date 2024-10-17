// src/redux/thunks/timeTrackThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PriceRandService } from '../../../services/adminPriceRand/adminPriceRand';
import { PriceRangeResponseDeleted } from '../../../types/adminPriceRand/deletedPriceRand';
import { PriceRangeRestore } from '../../../types/adminPriceRand/restorePriceRand';
interface FetchPriceRandParams {
  page: number;
  pageSize: number;
  search?: string;
}

export const fetchPriceRandDeleted = createAsyncThunk<PriceRangeResponseDeleted, FetchPriceRandParams>(
  'timeTracks/fetchTimeTracks',
  async ({ page, pageSize, search = '' }, { rejectWithValue }) => {
    try {
      const response  = await PriceRandService.deletedPricceRand(page, pageSize, search);
      return response;
    } catch (error) {
      return rejectWithValue('Error fetching time tracks');
    }
  }
);


export const restorePriceRandAdminThunk = createAsyncThunk<PriceRangeRestore , { id: string }, { rejectValue: string }>(
  'timeTrack/restorePriceRandAdmin',
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

