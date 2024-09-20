// src/services/bidService.ts

import instance from '../axios';
import { BidResponse, BidsState,
   UpdateBidAmountRequest, 
   UpdateBidAmountResponse } from '../../types/bidding/bidding';



export const createBid = async (
    productId: string,
    userId: string,
    bidAmount?: number
  ): Promise<BidResponse> => {
    const requestData = {
      productId,
      userId,
      bidAmount, // Ensure this matches the server's expected parameter
    };
  
    // Make the API request
    const response = await instance.post<BidResponse>('client/bidding/createBiding',
         requestData);

  
    // Return the response data
    return response.data;
  };


  export const fetchBidsByUser = async (userId: string): Promise<{ data: BidsState }> => {
    try {
      const response = await instance.get<{ data: BidsState }>(`client/bidding/bids`, {
        params: { userId } // Ensure the API receives the userId as a parameter
      });
        
      
      
      // Return the response data
      return response.data;
    } catch (error) {
      console.error('Error fetching bids:', error);
      throw new Error('Failed to fetch bids');
    }
  };



  export const updateBidAmountService = async (request: UpdateBidAmountRequest): Promise<UpdateBidAmountResponse> => {
    try {
        const response = await instance.put<UpdateBidAmountResponse>(`client/bidding/update-bid`, request, {
            headers: {
                'Content-Type': 'application/json',
                // Include authentication headers if needed
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        
        throw new Error( 'Failed to update bid amount');
    }
};


