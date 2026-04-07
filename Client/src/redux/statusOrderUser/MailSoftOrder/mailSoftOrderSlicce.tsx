// slices/biddingSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {  SoftDeleteOrderData } from '../../../types/iterationOrder/softDeleteForUser';
import { deleteOrderThunk } from './mailSoftOrderThunk';
 interface orderIteState {
    dleteOrder: SoftDeleteOrderData | null;
    loading: boolean;
    error: string | null;
  }
// Define the initial state based on BiddingState
const initialState: orderIteState = {
    dleteOrder: null,
  loading: false,
  error: null,
};

// Create the slice for bidding
const mailSoftOrderSlice = createSlice({
  name: 'softOrderSlice',
  initialState,
  reducers: {
    // Optionally define other synchronous actions
  },
  extraReducers: (builder) => {
    // Handle the deleteBiddingThunk actions
    builder
      .addCase(deleteOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrderThunk.fulfilled, (state, action: PayloadAction<SoftDeleteOrderData>) => {
        state.loading = false;
        state.dleteOrder = action.payload;
      })
      .addCase(deleteOrderThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default mailSoftOrderSlice.reducer;
