import { createAsyncThunk } from '@reduxjs/toolkit';
import { listBiidings } from '../../services/listBiddinggs/llistbidding';
import {BiddingResponse} from '../../types/listBiddings/listBids';
interface FetchListBidsParams {
  page: number;
  pageSize: number;
  search?: string;
}

export const fetchListBid = createAsyncThunk<BiddingResponse, FetchListBidsParams>(
  'bidding/listBids',
  async ({ page, pageSize, search = '' }, { rejectWithValue }) => {
    try {
      const response = await listBiidings(page, pageSize, search);
      return response;
    } catch (error) {
      return rejectWithValue('Error fetching time tracks');
    }
  }
);