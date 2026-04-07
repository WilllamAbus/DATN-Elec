import { createAsyncThunk } from '@reduxjs/toolkit';
import { getRandBid } from '../../../services/timeTrackProduct/randBidPrice';
import { RandBidResponseV2, RandBid } from '../../../types/getRanbid/getRandBid';

// Define the async thunk
export const fetchRandBid = createAsyncThunk<RandBid, string>(
  'randBid/fetchRandBid',
  async (productId: string, thunkAPI) => {
    try {
      const response: RandBidResponseV2 = await getRandBid(productId);
     
      
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
