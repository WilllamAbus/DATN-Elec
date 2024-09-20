
// redux/timeTrackProduct/randBidPrice/randBidPriceSlice.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getRandBid } from '../../../services/timeTrackProduct/randBidPrice';
import { RandBidResponse, RandBid } from '../../../types/timeTrackProduct/randBidPRice';

// Define the async thunk
export const fetchRandBid = createAsyncThunk<RandBid, string>(
  'randBid/fetchRandBid',
  async (productId: string, thunkAPI) => {
    try {
      const response: RandBidResponse = await getRandBid(productId);
     
      
      if (response.data.length > 0) {
        return response.data[0]; // Assuming you want to use the first bid item
      } else {
        return thunkAPI.rejectWithValue('No bid data available');
      }
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);
