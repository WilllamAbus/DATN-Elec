import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { softDelete } from '../Thunk';
import { ProductStateSoftDele, SoftDeleteResponse } from '../types/softdelete';

const initialState: ProductStateSoftDele = {
  products: [],
  status: 'idle',
  error: null,
};

const softDeleteSlice = createSlice({
  name: 'products/softdelete',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(softDelete.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(softDelete.fulfilled, (state, action: PayloadAction<SoftDeleteResponse>) => {
        state.status = 'success';
        if (action.payload.success) {
          state.products = state.products.map(product =>
            product._id === action.payload.data._id
              ? { ...product, status: action.payload.data.status }
              : product
          );
        }
      })
      .addCase(softDelete.rejected, (state, action: PayloadAction<unknown>) => {
        state.status = 'fail';
        state.error = action.payload instanceof Error ? action.payload.message : 'Lỗi không xác định';
      });
  },
});

export default softDeleteSlice.reducer;
