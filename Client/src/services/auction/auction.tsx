// src/services/auctionService.ts

import axios from '../axios';
import { AuctionData } from '../../types/auctions/auctions';

; // Replace with your actual API URL

const auctionService = {
  completeAuction: async (productId: string, timeTrackID: string): Promise<AuctionData> => {
    const response = await axios.post(`client/auctions/complete`, { productId, timeTrackID });
    console.log('respone', response.data.auction);
    
    return response.data.auction;
  }
};

export default auctionService;
