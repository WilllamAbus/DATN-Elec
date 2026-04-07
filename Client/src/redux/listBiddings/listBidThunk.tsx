import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUserBiddingHistory, getUserBiddingDetails } from '../../services/listBiddinggs/listbidding';
import { BiddingHistoryResponse,BiddingDetailsResponse } from '../../types/listBiddings/BiddingList';

interface FetchListBidsParams {
  page: number;
  pageSize: number;
}

export const fetchListBid = createAsyncThunk<BiddingHistoryResponse, FetchListBidsParams>(
  'bidding/listBids',
  async ({ page, pageSize }, { rejectWithValue }) => {
    try {
      const response = await getUserBiddingHistory(page, pageSize);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error fetching bidding history');
    }
  }
);


export const fetchBiddingDetails = createAsyncThunk<
  BiddingDetailsResponse,
  string
>("bidding/details", async (slug, { rejectWithValue }) => {
  try {
    const response = await getUserBiddingDetails(slug);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || "Error fetching bidding details");
  }
});
