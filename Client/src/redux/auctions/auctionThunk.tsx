// src/store/thunks/auctionThunks.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import auctionService from '../../services/auction/auction';
import { AuctionData } from '../../types/auctions/auctions';

export const completeAuction = createAsyncThunk<
  AuctionData, // Return type
  { productId: string; timeTrackID: string }, // Arguments type
  { rejectValue: string } // Rejection type
>(
  'auction/completeAuction',
  async ({ productId, timeTrackID }, thunkAPI) => {
    try {
      const updatedAuction = await auctionService.completeAuction(productId, timeTrackID);
      console.log('updateAuction', updatedAuction);
      
      return updatedAuction;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
