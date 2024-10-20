import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { softDeleteAuctinonThunk } from '../Thunk';
import { ProductAuction, SoftDeleteResponse } from '../../../../services/productAuction/types/softdelete';
interface ProductStateSoftDele {
  products: ProductAuction[];
  status: 'idle' | 'loading' | 'success' | 'fail';
  error: string | null;
}
const initialState: ProductStateSoftDele = {
  products: [],
  status: 'idle',
  error: null,
};
const softDeleteAuctionSlice = createSlice({
  name: 'products/softdelete',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(softDeleteAuctinonThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(softDeleteAuctinonThunk.fulfilled, (state, action: PayloadAction<SoftDeleteResponse>) => {
        state.status = 'success';
        if (action.payload.success) {
          const deletedProductId = action.payload.data?._id; 
          if (deletedProductId) {
            const deletedStatus = action.payload.data?.status || ''; 
            state.products = state.products.map(product =>
              product._id === deletedProductId
                ? { ...product, status: deletedStatus } 
                : product
            );
          }
        }
      })
      .addCase(softDeleteAuctinonThunk.rejected, (state, action: PayloadAction<unknown>) => {
        state.status = 'fail';
        state.error = (action.payload as SoftDeleteResponse)?.msg || 'Lỗi không xác định'; 
      });
  },
});

export default softDeleteAuctionSlice.reducer;
