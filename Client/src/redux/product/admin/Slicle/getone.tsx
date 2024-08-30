import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getOne } from '../Thunk/getone';
import { ProductGetOne, } from '../types';
import { SerializedError } from '@reduxjs/toolkit';

interface ProductState {
  product: ProductGetOne | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: SerializedError | null;
}

const initialState: ProductState = {
  product: null,
  status: 'idle',
  error: null,
};

const getOneSlice = createSlice({
  name: 'product/getone',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOne.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getOne.fulfilled, (state, action: PayloadAction<ProductGetOne>) => {
        state.status = 'succeeded';
        state.product = action.payload;
      })
      .addCase(getOne.rejected, (state, action: PayloadAction<unknown, string, never, SerializedError>) => {
        state.status = 'failed';
        state.error = action.error; 
      });
  },
});

export default getOneSlice.reducer;
