import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Voucher } from '../../types/Voucher.d';
import { createVoucher, deleteVoucher, fetchVoucherById, fetchVouchers, updateVoucher } from './voucherThunk';

interface VoucherState {
  vouchers: Voucher[];
  voucher: Voucher | null; // New state for a single discount
  loading: boolean;
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: VoucherState = {
  vouchers: [],
  voucher: null,
  loading: false,
  error: null,
  status: 'idle',
};

const discountSlice = createSlice({
  name: 'discounts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVouchers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchVouchers.fulfilled, (state, action: PayloadAction<Voucher[]>) => {
        state.vouchers = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchVouchers.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch Voucher';
        state.status = 'failed';
      })
      .addCase(createVoucher.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createVoucher.fulfilled, (state, action: PayloadAction<Voucher>) => {
        state.vouchers.push(action.payload);
        state.status = 'succeeded';
      })
      .addCase(createVoucher.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create Voucher';
        state.status = 'failed';
      })
      .addCase(updateVoucher.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateVoucher.fulfilled, (state, action: PayloadAction<Voucher>) => {
        const index = state.vouchers.findIndex(d => d._id === action.payload._id);
        if (index !== -1) {
          state.vouchers[index] = action.payload;
        }
        state.status = 'succeeded';
      })
      .addCase(updateVoucher.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update discount';
        state.status = 'failed';
      })
      .addCase(deleteVoucher.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteVoucher.fulfilled, (state, action: PayloadAction<void, string, { arg: string }>) => {
        state.vouchers = state.vouchers.filter(d => d._id !== action.meta.arg);
        state.status = 'succeeded';
      })
      .addCase(deleteVoucher.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete discount';
        state.status = 'failed';
      })
      .addCase(fetchVoucherById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVoucherById.fulfilled, (state, action: PayloadAction<Voucher>) => {
        state.voucher = action.payload;
        state.loading = false;
        state.status = 'succeeded';
      })
      .addCase(fetchVoucherById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch discount';
        state.status = 'failed';
      });
  },
});

export default discountSlice.reducer;
