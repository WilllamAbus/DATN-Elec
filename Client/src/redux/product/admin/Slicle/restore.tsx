import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { restoreThunk } from '../Thunk'; 
import { RestoreResponse, ProductStateRestore } from '../types/restore';

const initialState: ProductStateRestore = {
  products: [],
  status: 'idle',
  error: null,
};

const restoreSlice = createSlice({
  name: 'products/restore',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(restoreThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(restoreThunk.fulfilled, (state, action: PayloadAction<RestoreResponse>) => {
        state.status = 'success';
        if (action.payload.success) {
          state.products.push(action.payload.data!);
        }
      })
      .addCase(restoreThunk.rejected, (state, action) => {
        state.status = 'fail';
        state.error = action.payload?.error || 'Lỗi không xác định';
      });
  },
});

export default restoreSlice.reducer;
