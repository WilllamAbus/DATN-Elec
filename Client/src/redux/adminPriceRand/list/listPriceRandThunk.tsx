// src/redux/thunks/timeTrackThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PriceRandService } from '../../../services/adminPriceRand/adminPriceRand';
import { PriceRangeResponse } from '../../../types/adminPriceRand/listPricrRand';

interface FetchPriceRandParams {
  page: number;
  pageSize: number;
  search?: string;
}

export const fetchPriceRand = createAsyncThunk<PriceRangeResponse, FetchPriceRandParams>(
  'timeTracks/fetchTimeTracks',
  async ({ page, pageSize, search = '' }, { rejectWithValue }) => {
    try {
      const response  = await PriceRandService.getAllPriceRand(page, pageSize, search);
      return response;
    } catch (error) {
      return rejectWithValue('Error fetching time tracks');
    }
  }
);
