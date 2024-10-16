// src/redux/slices/timeTrackSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchPriceRand } from './listPriceRandThunk';
import {PriceRange  } from '../../../types/adminPriceRand/listPricrRand';

interface PriceRandState {
  listPriceRand: PriceRange[];
  totalPages: number;
  currentPage: number;

  loading: boolean;
  error: string | null;
}

const initialState: PriceRandState = {
    listPriceRand: [],
  totalPages: 1,
  currentPage: 1,

  loading: false,
  error: null,
};

const priceRadnListSlice = createSlice({
  name: 'timeTracks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPriceRand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPriceRand.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.listPriceRand = action.payload.data.priceRanges;
        state.totalPages = action.payload.data.totalPages;
        state.currentPage = action.payload.data.currentPage;
    
      })
      .addCase(fetchPriceRand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default priceRadnListSlice.reducer;