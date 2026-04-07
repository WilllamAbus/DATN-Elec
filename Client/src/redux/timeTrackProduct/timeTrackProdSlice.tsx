// src/slices/productSlice.ts

import { createSlice } from '@reduxjs/toolkit';
import { fetchProductByTimeTrack } from './timeTrackProdThunk';
import { ProductResponse } from '../../types/timeTrackProduct/timeTrackProduct';

interface ProductState {
  productTimeTrack: ProductResponse | null; // Updated to ProductResponse
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  productTimeTrack: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductByTimeTrack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductByTimeTrack.fulfilled, (state, action) => {
        state.loading = false;
        state.productTimeTrack = action.payload; // Directly set the ProductResponse
      })
      .addCase(fetchProductByTimeTrack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Error message from thunk
      });
  },
});

export default productSlice.reducer;

