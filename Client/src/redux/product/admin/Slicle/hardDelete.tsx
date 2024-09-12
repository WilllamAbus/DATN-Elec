import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { hardDeleteThunk } from '../Thunk'; 
import { HardDeleteResponse, ProductStateHardDelete } from '../types/hardDelete';

const initialState: ProductStateHardDelete = {
  products: [],
  status: 'idle',
  error: null,
};

const hardDeleteSlice = createSlice({
  name: 'products/hardDelete',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(hardDeleteThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(hardDeleteThunk.fulfilled, (state, action: PayloadAction<HardDeleteResponse>) => {
        state.status = 'success';
        if (action.payload.success) {
          state.products = state.products.filter(product => product._id !== action.payload.data?._id);
        }
      })
      .addCase(hardDeleteThunk.rejected, (state, action) => {
        state.status = 'fail';
        if (action.payload) {
          state.error = action.payload.error || 'Lỗi không xác định';
        } else {
          state.error = 'Lỗi không xác định';
        }
      });
      
  },
});

export default hardDeleteSlice.reducer;
