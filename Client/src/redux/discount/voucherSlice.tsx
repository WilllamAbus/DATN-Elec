import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Voucher } from '../../types/Voucher.d';
import { createVoucher, 
  deleteVoucher, 
  fetchVoucherById, 
  fetchVouchers, 
  updateVoucher ,
softDeleteVoucherThunk,
fetchDeletedVoucherThunk,
restoreVoucherThunk} from './voucherThunk';

interface VoucherState {
  vouchers: Voucher[];
  deletedVoucher: Voucher[]
  voucher: Voucher | null; // New state for a single discount
  loading: boolean;
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  message: string | null;
}

const initialState: VoucherState = {
  vouchers: [],
  deletedVoucher:[],
  voucher: null,
  loading: false,
  error: null,
  status: 'idle',
  message:null
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
      })



      .addCase(fetchDeletedVoucherThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDeletedVoucherThunk.fulfilled, (state, action: PayloadAction<Voucher[]>) => {
        state.status = 'succeeded';
        state.deletedVoucher = action.payload;
        state.message = null;
      })
      .addCase(fetchDeletedVoucherThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch deleted order';
        state.message = null;
      })
      // .addCase(restoreCategoryThunk.pending, (state) => {
      //   state.status = 'loading';
      // })
      .addCase(restoreVoucherThunk.fulfilled, (state, action: PayloadAction<Voucher>) => {
        state.status = 'succeeded';
        if (Array.isArray(state.deletedVoucher)) {
          const existingOrder = state.deletedVoucher.find(order => order._id === action.payload._id);
          if (!existingOrder) {
            state. vouchers.push(action.payload);
          }
        } else {
          console.error('State.deletedOrder is not an array. Resetting to empty array.');
          state.deletedVoucher = [action.payload];
        }
      
        state.error = null;
        // state.deletedOrder = state.deletedOrder.filter(order => order._id !== action.payload._id);
        // state.orders.push(action.payload);
        // state.message = null;
      })
      .addCase(restoreVoucherThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to restore category';
        state.message = null;
      })
      // .addCase(softDeleteCategoryThunk.pending, (state) => {
      //   state.status = 'loading';
      // })
      .addCase(softDeleteVoucherThunk.fulfilled, (state, action: PayloadAction<Voucher>) => {
        state.status = 'succeeded';
      
     
      
        if (Array.isArray(state.deletedVoucher)) {
          const existingOrder = state.deletedVoucher.find(voucher => voucher._id === action.payload._id);
          if (!existingOrder) {
            state.deletedVoucher.push(action.payload);
          }
        } else {
          console.error('State.deletedOrder is not an array. Resetting to empty array.');
          state.deletedVoucher = [action.payload];
        }
      
        state.error = null;
      })
      
      
      .addCase(softDeleteVoucherThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to soft delete order';
      });

  },
});

export default discountSlice.reducer;
