import { createAsyncThunk } from '@reduxjs/toolkit';

import { listBiidingActive } from '../../services/listBiddinggs/listBiddingActive';

import {BiddingResponseActive} from '../../types/listBiddings/listBidActive';
interface FetchListBidsParamsActive {
    pageActive: number;
    pageSizeActive: number;
    searchActive?: string;
  }
  export const fetchListBidActive = createAsyncThunk<BiddingResponseActive, FetchListBidsParamsActive>(
    'biddingActive/listBids',
    async ({ pageActive, pageSizeActive, searchActive = '' }, { rejectWithValue }) => {
      try {
        const response = await listBiidingActive(pageActive, pageSizeActive, searchActive);
        return response;
      } catch (error) {
        return rejectWithValue('Error fetching time tracks');
      }
    }
  );