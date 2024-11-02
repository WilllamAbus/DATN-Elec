// redux/thunks/auctionThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAuctionData } from '../../services/auction/auctCheckout';
import {AuctionData } from '../../types/auctions/auctCheckout';

export const fetchAuction = createAsyncThunk<AuctionData, string>(
  'auction/fetchAuctionData',
  async (productId: string) => {
    const data = await fetchAuctionData(productId);
    console.log('auction', data);
    
    return data;
  }
);
