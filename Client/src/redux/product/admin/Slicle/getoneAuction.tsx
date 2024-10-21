import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getOneAuctionThunk } from '../Thunk/getoneAuction';
import { ProductAuction, } from '../../../../services/productAuction/types/getone';
import { SerializedError } from '@reduxjs/toolkit';

interface ProductState {
  product: ProductAuction | null;
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
      .addCase(getOneAuctionThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getOneAuctionThunk.fulfilled, (state, action: PayloadAction<ProductAuction>) => {
        state.status = 'succeeded';
        state.product = action.payload;
      })
      .addCase(getOneAuctionThunk.rejected, (state, action: PayloadAction<unknown, string, never, SerializedError>) => {
        state.status = 'failed';
        state.error = action.error; 
      });
  },
});

export default getOneSlice.reducer;
