import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { selectProductsThunk } from '../../../thunk';
import { ProductStateList, SelectProductResponse } from '../../../../../services/post/admin/types/selectProduct';

const initialState: ProductStateList = {
  products: [],
  status: 'idle',
  error: null,
};

const selectProductsSlice = createSlice({
  name: 'products/select',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(selectProductsThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(selectProductsThunk.fulfilled, (state, action: PayloadAction<SelectProductResponse>) => {
        state.status = 'success';
        state.products = action.payload.products; 
      })
      .addCase(selectProductsThunk.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'fail';
        state.error = action.payload || 'Lỗi không xác định';
      });
  },
});

export default selectProductsSlice.reducer;
