import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { restoreAuctionThunk } from '../Thunk'; 
import { ResponseSuccess, initialRestoreAuctionState } from "../../../../services/productAuction/types/hardDeleteAndRestoreAuction";

const restoreAuctionSlice = createSlice({
  name: 'auctions/restore',
  initialState: initialRestoreAuctionState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(restoreAuctionThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(restoreAuctionThunk.fulfilled, (state, action: PayloadAction<ResponseSuccess>) => {
        state.status = 'success';
        if (action.payload.success) {
          state.products = state.products.map((auction) =>
            auction._id === action.payload.data?._id ? { ...auction, status: 'active' } : auction
          );
        }
      })
      .addCase(restoreAuctionThunk.rejected, (state, action) => {
        state.status = 'fail';
        state.error = action.payload?.msg || 'Lỗi không xác định';
      });
  },
});

export default restoreAuctionSlice.reducer;
