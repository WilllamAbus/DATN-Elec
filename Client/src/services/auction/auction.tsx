// src/services/auctionService.ts

import axios from '../axios';
import { AuctionDataComplete } from '../../types/auctions/auctions';

; // Replace with your actual API URL

const auctionService = {
  completeAuction: async (productId: string, timeTrackID: string,): Promise<AuctionDataComplete> => {
    const response = await axios.post('client/auctions/complete', { productId, timeTrackID  },  );
 
    
    return response.data.auction;
  }
};

export default auctionService;
