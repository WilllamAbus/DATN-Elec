import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { deleteVariantThunk } from '../Thunk';
import { ResponseSuccess, initialDeleteVariantState } from "../../../../services/product_v2/admin/types/deleteVariant";

const deleteVariantSlice = createSlice({
  name: 'variants/deleteVariant',
  initialState: initialDeleteVariantState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteVariantThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteVariantThunk.fulfilled, (state, action: PayloadAction<ResponseSuccess>) => {
        state.status = 'success';
        if (action.payload.success) {
          state.productVariant = state.productVariant.filter(
            variant => variant._id !== action.payload.data?._id
          );
        }
      })
      .addCase(deleteVariantThunk.rejected, (state, action) => {
        state.status = 'fail';
        state.error = action.payload?.msg || 'Lỗi không xác định';
      });
  },
});

export default deleteVariantSlice.reducer;
