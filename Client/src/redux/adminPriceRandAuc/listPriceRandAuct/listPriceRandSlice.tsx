// src/redux/slices/timeTrackSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchPriceRand , softDelPriceRandAdminThunk} from './listPriceRandAuctThunk';
import {PriceRange, PriceRangeAuctSoftDel  } from '../../../types/adminPriceRandAuct/listPriceRandAuct';

interface PriceRandState {
  listPriceRandAuct: PriceRange[];
  softDelPriceRandAuct: PriceRangeAuctSoftDel[];
  delPriceRand: PriceRangeAuctSoftDel|null
  totalPages: number;
  currentPage: number;

  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: PriceRandState = {
    listPriceRandAuct: [],
    softDelPriceRandAuct:[],
    delPriceRand: null,
  totalPages: 1,
  currentPage: 1,

  loading: false,
  error: null,
  successMessage: null
};

const priceRadnListAuctSlice = createSlice({
  name: 'prictRadAuct',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPriceRand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPriceRand.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.listPriceRandAuct = action.payload.data.priceRangesAuct;
        state.totalPages = action.payload.data.totalPages;
        state.currentPage = action.payload.data.currentPage;
    
      })
      .addCase(fetchPriceRand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(softDelPriceRandAdminThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(softDelPriceRandAdminThunk.fulfilled, (state, action) => {
        state.loading = false;
        
        state.delPriceRand = action.payload;
      
         // Thay đ��i kiểu đúng,
        // Kiểm tra softDelorder trước khi gọi filter
        // state.shippingStatus = state.shippingStatus.filter((order) => order._id !== action.payload._id);
    
        if (Array.isArray(state.listPriceRandAuct)) {
          state.softDelPriceRandAuct = [];
          // Remove the deleted time track from the timeTracks state
          state.listPriceRandAuct = state.listPriceRandAuct.filter(
            (rand) => rand._id !== action.payload._id // Filter out the deleted item
          );
        }
       
      state.softDelPriceRandAuct.push(action.payload);
      state.successMessage = "Xóa đơn hàng thành công";
        // state.successMessage = "Xóa đơn hàng thành công";
      })
      .addCase(softDelPriceRandAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

  },
});

export default priceRadnListAuctSlice.reducer;