// src/redux/thunks/timeTrackThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PriceRandService } from '../../../services/adminPriceRand/adminPriceRand';
import { PriceRangeResponseDeleted } from '../../../types/adminPriceRand/deletedPriceRand';

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
