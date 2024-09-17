import { createSlice } from '@reduxjs/toolkit';
import { fetchRandBid } from './randBidPriceThunk';
import { RandBid } from '../../../types/timeTrackProduct/randBidPRice';

interface RandBidState {
  [productId: string]: RandBid;
}

const initialState: RandBidState = {};

const randBidSlice = createSlice({
  name: 'randBid',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRandBid.pending, () => {
        // Optional: handle pending state if needed
      })
      .addCase(fetchRandBid.fulfilled, (state, action) => {       
        // If productId is not part of randBidData
        const randBidData = action.payload;
        const { productId } = randBidData;
        if (productId) {
          state[productId] = randBidData;  // Ensure state matches expected structure
        }
      })
      .addCase(fetchRandBid.rejected, () => {
        // Optional: handle error state if needed
      });
  },
});

export default randBidSlice.reducer;
