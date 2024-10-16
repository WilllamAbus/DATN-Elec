// src/redux/slices/timeTrackSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchPriceRandDeleted } from './deletedPriceRandThunk';
import {PriceRangeDeleted  } from '../../../types/adminPriceRand/deletedPriceRand';

interface PriceRandState {
  deletedPriceRand: PriceRangeDeleted[];
  totalPages: number;
  currentPage: number;

  loading: boolean;
  error: string | null;
}

const initialState: PriceRandState = {
    deletedPriceRand: [],
  totalPages: 1,
  currentPage: 1,

  loading: false,
  error: null,
};

const priceRadnDeletedSlice = createSlice({
  name: 'timeTracks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPriceRandDeleted.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPriceRandDeleted.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.deletedPriceRand = action.payload.data.priceRanges;
        state.totalPages = action.payload.data.totalPages;
        state.currentPage = action.payload.data.currentPage;
    
      })
      .addCase(fetchPriceRandDeleted.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default priceRadnDeletedSlice.reducer;