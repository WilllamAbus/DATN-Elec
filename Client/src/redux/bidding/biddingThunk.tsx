// src/features/bids/bidThunk.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { createBid, fetchBidsByUser ,updateBidAmountService } from '../../services/bidding/bidding';
import { BidResponse, BidsState, UpdateBidAmountRequest, UpdateBidAmountResponse } from '../../types/bidding/bidding';

export const createBidThunk = createAsyncThunk<BidResponse, { productId: string; userId: string; bidAmount?: number }>(
    'bids/createBid',
    async ({ productId, userId, bidAmount }, { rejectWithValue }) => {
      try {
        // Call the service function to create the bid
        const response = await createBid(productId, userId, bidAmount);
    
  
        return response;
      } catch (error) {
        return rejectWithValue(
          error instanceof Error ? error.message : 'An unknown error occurred'
        );
      }
    }
  );


  export const fetchBidsByUserThunk = createAsyncThunk<BidsState, string>(
    'bidding/fetchBidsByUser',
    async (userId: string, { rejectWithValue }) => {
      try {
        const response = await fetchBidsByUser(userId);
      
        
        return response.data;
      } catch (error) {
        console.error(error);
        return rejectWithValue('Không tìm thấy giá trị');
      }
    }
  );


  export const updateBidAmountThunk = createAsyncThunk(
    'bidding/updateBidAmount',
    async (request: UpdateBidAmountRequest, { rejectWithValue }) => {
        try {
            const response: UpdateBidAmountResponse = await updateBidAmountService(request);
            return response;
        } catch (error) {
            return rejectWithValue('Không tìm thấy giá trị');
        }
    }
);