  import { createSlice, PayloadAction } from '@reduxjs/toolkit';
  import { getOneProductVariantThunk } from '../Thunk/getOneProductVariant';
  import { ProductVariant } from '../../../../services/product_v2/admin/types/editVariant';
  import { SerializedError } from '@reduxjs/toolkit';

  interface ProductVariantState {
    variant: ProductVariant | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: SerializedError | null;
  }

  const initialState: ProductVariantState = {
    variant: null,
    status: 'idle',
    error: null,
  };

  const getOneProductVariantSlice = createSlice({
    name: 'productVariant/getone',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getOneProductVariantThunk.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(getOneProductVariantThunk.fulfilled, (state, action: PayloadAction<ProductVariant>) => {
          console.log("Fulfilled action payload:", action.payload);
          state.status = 'succeeded';
          state.variant = action.payload;
        })
        .addCase(getOneProductVariantThunk.rejected, (state, action: PayloadAction<unknown, string, never, SerializedError>) => {
          state.status = 'failed';
          state.error = action.error;
        });
    },
  });

  export default getOneProductVariantSlice.reducer;
