// redux/thunks/auctionThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAuctionData } from '../../services/auction/auctCheckout';
import {AuctionData } from '../../types/auctions/auctCheckout';

interface FetchAuctionArgs {
  userId: string;
  productId: string;
}

export const fetchAuction = createAsyncThunk<AuctionData, FetchAuctionArgs>(
  'auction/fetchAuctionData',
  async ({ userId, productId }) => {
    const data = await fetchAuctionData(userId, productId);

    
    return data;
  }
);
