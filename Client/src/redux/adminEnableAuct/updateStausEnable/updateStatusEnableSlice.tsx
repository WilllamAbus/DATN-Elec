// src/redux/orderAucAdmin/orderAucAdminSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import {updateEnableAuctStatusThunk,  } from './updateStatusEnanleThunk'; // Adjust the import path as necessary
import { StatusEnableWinner } from '../../../types/adminEnbaleAuct/updateEnableAuct';

interface OrderAucAdminState {
  confirmOrder: StatusEnableWinner | null;
//   confirmOrderCash: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderAucAdminState = {
  confirmOrder: null,
//   confirmOrderCash: null,
  loading: false,
  error: null,
};

// Thunk for updating order status


const orderUpdateStatus = createSlice({
  name: 'enableStatus',
  initialState,
  reducers: {
    // Define any additional reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateEnableAuctStatusThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEnableAuctStatusThunk.fulfilled, (state, action) => {

        
        state.confirmOrder = action.payload; // Update the order with the new status
        state.loading = false;
        state.error = null;
      })
      .addCase(updateEnableAuctStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Capture error message
      })


    //   .addCase(updateOrderStatusThunkCash.pending, (state) => {
    //     state.loading = true;
    //   })
    //   .addCase(updateOrderStatusThunkCash.fulfilled, (state, action) => {

        
    //     state.confirmOrder = action.payload; // Update the order with the new status
    //     state.loading = false;
    //     state.error = null;
    //   })
    //   .addCase(updateOrderStatusThunkCash.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload as string; // Capture error message
    //   })
  },
});

export default orderUpdateStatus.reducer;
