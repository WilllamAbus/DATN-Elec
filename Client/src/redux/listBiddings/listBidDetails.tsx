
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchBiddingDetails } from './listBidThunk';
import { BiddingDetailsResponse } from '../../types/listBiddings/BiddingList';

interface BiddingDetailsState {
  details: BiddingDetailsResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: BiddingDetailsState = {
  details: null,
  loading: false,
  error: null,
};

const biddingDetailsSlice = createSlice({
  name: 'biddingDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBiddingDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.details = null;
      })
      .addCase(fetchBiddingDetails.fulfilled, (state, action: PayloadAction<BiddingDetailsResponse>) => {
        state.loading = false;
        state.details = action.payload;
      })
      .addCase(fetchBiddingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default biddingDetailsSlice.reducer;
