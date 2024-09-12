import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { list } from '../Thunk/list';
import { ProductStateList, ListProductResponse, } from '../types/list'; 

const initialState: ProductStateList = {
  products: [],
  status: 'idle',
  error: null,
};

const listSlice = createSlice({
  name: 'products/list',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(list.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(list.fulfilled, (state, action: PayloadAction<ListProductResponse>) => {
        state.status = 'success';
        state.products = action.payload.products; 
      })
      .addCase(list.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'fail';
        state.error = action.payload || 'Lỗi không xác định';
      });
  },
});

export default listSlice.reducer;
