import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { hardDeleteAuctionThunk } from '../Thunk'; 
import { ResponseSuccess, initialHardDeleteAuctionState } from "../../../../services/productAuction/types/hardDeleteAndRestoreAuction";

const hardDeleteAuctionSlice = createSlice({
  name: 'auctions/hardDelete',
  initialState: initialHardDeleteAuctionState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(hardDeleteAuctionThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(hardDeleteAuctionThunk.fulfilled, (state, action: PayloadAction<ResponseSuccess>) => {
        state.status = 'success';
        if (action.payload.success) {
          state.products = state.products.filter(auction => auction._id !== action.payload.data?._id);
        }
      })
      .addCase(hardDeleteAuctionThunk.rejected, (state, action) => {
        state.status = 'fail';
        state.error = action.payload?.msg || 'Lỗi không xác định';
      });
  },
});

export default hardDeleteAuctionSlice.reducer;
