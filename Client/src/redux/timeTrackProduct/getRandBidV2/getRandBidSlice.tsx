import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchRandBid } from './getRandBidThunk';
import { RandBid } from '../../../types/getRanbid/getRandBid';

interface RandBidState {
  bid: RandBid | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: RandBidState = {
  bid: null,
  status: 'idle',
  error: null,
};

const randBidSlice = createSlice({
  name: 'randBid',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRandBid.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRandBid.fulfilled, (state, action: PayloadAction<RandBid>) => {
        state.status = 'succeeded';
        state.bid = action.payload;
      })
      .addCase(fetchRandBid.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default randBidSlice.reducer;
