// src/redux/slices/timeTrackSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchPriceRand  } from './listPriceRandAuctThunk';
import {PriceRange,   } from '../../../types/adminPriceRandAuct/listPriceRandAuct';

interface PriceRandState {
  listPriceRandAuct: PriceRange[];
//   softDelPriceRandAuct: PriceRangeAuctSoftDel[];
//   delPriceRand: PriceRangeAuctSoftDel|null
  totalPages: number;
  currentPage: number;

  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: PriceRandState = {
    listPriceRandAuct: [],
    // softDelPriceRandAuct:[],
    // delPriceRand: null,
  totalPages: 1,
  currentPage: 1,

  loading: false,
  error: null,
  successMessage: null
};

const priceRadnListAuctSlice = createSlice({
  name: 'prictRadAuct',
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
        state.listPriceRandAuct = action.payload.data.priceRangesAuct;
        state.totalPages = action.payload.data.totalPages;
        state.currentPage = action.payload.data.currentPage;
    
      })
      .addCase(fetchPriceRand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

  },
});

export default priceRadnListAuctSlice.reducer;