import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { selectSupplierThunk } from '../Thunk';
import { SelectSupplierResponse, Supplier } from '../../../../services/product_v2/admin/types/select/supplier';

interface SupplierState {
  suppliers: Supplier[];
  status: 'idle' | 'loading' | 'success' | 'fail';
  error: string | null;
}

const initialState: SupplierState = {
  suppliers: [],
  status: 'idle',
  error: null,
};

const selectSupplierSlice = createSlice({
  name: 'supplier/select',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(selectSupplierThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(selectSupplierThunk.fulfilled, (state, action: PayloadAction<SelectSupplierResponse>) => {
        state.status = 'success';
        state.suppliers = action.payload.selectSuppliers;  
      })
      .addCase(selectSupplierThunk.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'fail';
        state.error = action.payload || 'Lỗi không xác định';
      });
  },
});

export default selectSupplierSlice.reducer;
