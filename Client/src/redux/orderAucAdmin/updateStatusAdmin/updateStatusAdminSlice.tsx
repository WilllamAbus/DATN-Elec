// src/redux/orderAucAdmin/orderAucAdminSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import {updateOrderStatusThunk, updateOrderStatusThunkCash  } from './updateStatusAdminThunk'; // Adjust the import path as necessary
import { Order } from '../../../types/adminOrder/orderUpdateStatus';

interface OrderAucAdminState {
  confirmOrder: Order | null;
  confirmOrderCash: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderAucAdminState = {
  confirmOrder: null,
  confirmOrderCash: null,
  loading: false,
  error: null,
};

// Thunk for updating order status


const orderUpdateStatus = createSlice({
  name: 'orderAucAdmin',
  initialState,
  reducers: {
    // Define any additional reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateOrderStatusThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {

        
        state.confirmOrder = action.payload; // Update the order with the new status
        state.loading = false;
        state.error = null;
      })
      .addCase(updateOrderStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Capture error message
      })


      .addCase(updateOrderStatusThunkCash.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatusThunkCash.fulfilled, (state, action) => {

        
        state.confirmOrder = action.payload; // Update the order with the new status
        state.loading = false;
        state.error = null;
      })
      .addCase(updateOrderStatusThunkCash.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Capture error message
      })
  },
});

export default orderUpdateStatus.reducer;
