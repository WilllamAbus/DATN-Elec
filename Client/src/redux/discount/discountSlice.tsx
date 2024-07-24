import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Discount } from '../../types/Discount.d';
import { fetchDiscounts, createDiscount, updateDiscount, deleteDiscount, fetchDiscountById } from './discountThunk';

interface DiscountState {
  discounts: Discount[];
  discount: Discount | null; // New state for a single discount
  loading: boolean;
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: DiscountState = {
  discounts: [],
  discount: null,
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
      .addCase(fetchDiscounts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDiscounts.fulfilled, (state, action: PayloadAction<Discount[]>) => {
        state.discounts = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchDiscounts.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch discounts';
        state.status = 'failed';
      })
      .addCase(createDiscount.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createDiscount.fulfilled, (state, action: PayloadAction<Discount>) => {
        state.discounts.push(action.payload);
        state.status = 'succeeded';
      })
      .addCase(createDiscount.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create discount';
        state.status = 'failed';
      })
      .addCase(updateDiscount.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateDiscount.fulfilled, (state, action: PayloadAction<Discount>) => {
        const index = state.discounts.findIndex(d => d._id === action.payload._id);
        if (index !== -1) {
          state.discounts[index] = action.payload;
        }
        state.status = 'succeeded';
      })
      .addCase(updateDiscount.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update discount';
        state.status = 'failed';
      })
      .addCase(deleteDiscount.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteDiscount.fulfilled, (state, action: PayloadAction<void, string, { arg: string }>) => {
        state.discounts = state.discounts.filter(d => d._id !== action.meta.arg);
        state.status = 'succeeded';
      })
      .addCase(deleteDiscount.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete discount';
        state.status = 'failed';
      })
      .addCase(fetchDiscountById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiscountById.fulfilled, (state, action: PayloadAction<Discount>) => {
        state.discount = action.payload;
        state.loading = false;
        state.status = 'succeeded';
      })
      .addCase(fetchDiscountById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch discount';
        state.status = 'failed';
      });
  },
});

export default discountSlice.reducer;
