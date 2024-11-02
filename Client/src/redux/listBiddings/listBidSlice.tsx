// src/redux/slices/timeTrackSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchListBid} from './listBidThunk';
import {Bidding} from '../../types/listBiddings/listBids';
interface biddingState {
    Bidding: Bidding[];

  totalPages: number;
  currentPage: number;

  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: biddingState = {
    Bidding: [],

  totalPages: 1,
  currentPage: 1,

  loading: false,
  error: null,
  successMessage: null
};

const timeTrackSlice = createSlice({
  name: 'timeTracks',
  initialState,
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListBid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListBid.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.Bidding = action.payload.data.Bidding;
        state.totalPages = action.payload.data.totalPages;
        state.currentPage = action.payload.data.currentPage;
    
      })
      .addCase(fetchListBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


  
  },
});

export default timeTrackSlice.reducer;