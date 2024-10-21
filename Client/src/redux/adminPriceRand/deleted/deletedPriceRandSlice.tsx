// src/redux/slices/timeTrackSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchPriceRandDeleted, restorePriceRandAdminThunk } from './deletedPriceRandThunk';
import {PriceRangeDeleted  } from '../../../types/adminPriceRand/deletedPriceRand';
import {PriceRangeRestore  } from '../../../types/adminPriceRand/restorePriceRand';
interface PriceRandState {
  deletedPriceRand: PriceRangeDeleted[];
  resoredPriceRand: PriceRangeRestore[];
  priceRandRestore: PriceRangeRestore | null
  totalPages: number;
  currentPage: number;

  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: PriceRandState = {
    deletedPriceRand: [],
    resoredPriceRand: [],
    priceRandRestore: null,
  totalPages: 1,
  currentPage: 1,

  loading: false,
  error: null,
  successMessage:null
};

const priceRadnDeletedSlice = createSlice({
  name: 'timeTracks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPriceRandDeleted.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPriceRandDeleted.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.deletedPriceRand = action.payload.data.priceRanges;
        state.totalPages = action.payload.data.totalPages;
        state.currentPage = action.payload.data.currentPage;
    
      })
      .addCase(fetchPriceRandDeleted.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


      .addCase(restorePriceRandAdminThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(restorePriceRandAdminThunk.fulfilled, (state, action) => {
        state.loading = false;
        
        state.priceRandRestore = action.payload;
      
         // Thay đ��i kiểu đúng,
        // Kiểm tra softDelorder trước khi gọi filter
        // state.shippingStatus = state.shippingStatus.filter((order) => order._id !== action.payload._id);
    
        if (Array.isArray(state.deletedPriceRand)) {
          // Remove the deleted time track from the timeTracks state
          state.deletedPriceRand = state.deletedPriceRand.filter(
            (rand) => rand._id !== action.payload._id // Filter out the deleted item
          );
        }

        if (!Array.isArray(state.resoredPriceRand)) {
          state.resoredPriceRand = []; // Initialize if undefined
        }
        state.resoredPriceRand.push(action.payload);
      state.successMessage = "Xóa đơn hàng thành công";
        // state.successMessage = "Xóa đơn hàng thành công";
      })
      .addCase(restorePriceRandAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export default priceRadnDeletedSlice.reducer;