import { createAsyncThunk } from '@reduxjs/toolkit';
import { getProductByTimeTrack } from '../../services/timeTrackProduct/timeTrackProd';
import { ProductResponse } from '../../types/timeTrackProduct/timeTrackProduct';

// Ensure this function returns a full ProductResponse object
export const fetchProductByTimeTrack = createAsyncThunk<ProductResponse, string>(
    'product/fetchByTimeTrack',
    async (productId, thunkAPI) => {
      try {
        const data = await getProductByTimeTrack(productId);
        return data; // This should match the ProductResponse type
      } catch (error) {
        console.error('Error in thunk:', error);
        return thunkAPI.rejectWithValue('Failed to fetch product details');
      }
    }
  );
  
  
