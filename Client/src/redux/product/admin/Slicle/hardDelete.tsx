import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { hardDeleteThunk } from '../Thunk'; 
import { ResponseSuccess, initialHardDeleteState } from "../../../../services/product_v2/admin/types/hardDelete";

const hardDeleteSlice = createSlice({
  name: 'products/hardDelete',
  initialState: initialHardDeleteState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(hardDeleteThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(hardDeleteThunk.fulfilled, (state, action: PayloadAction<ResponseSuccess>) => {
        state.status = 'success';
        if (action.payload.success) {
          state.products = state.products.filter(product => product._id !== action.payload.data?._id);
        }
      })
      .addCase(hardDeleteThunk.rejected, (state, action) => {
        state.status = 'fail';
        state.error = action.payload?.error || 'Lỗi không xác định';
      });
  },
});

export default hardDeleteSlice.reducer;
