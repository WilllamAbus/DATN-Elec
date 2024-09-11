import instance from '../axios';
import { RandBidResponse } from '../../types/timeTrackProduct/randBidPRice';
import { RandBidResponseV2 } from '../../types/getRanbid/getRandBid';
export const getRandBid = async (productId: string): Promise<RandBidResponse> => {
    try {
      const response = await instance.get<RandBidResponse>(`admin/randbid/getRandBid/${productId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch rand bids: ${error.message}`);
    }
  };

  export const getRandBidV2 = async (productId: string): Promise< RandBidResponseV2 > => {
    try {
      const response = await instance.get< RandBidResponseV2 >(`admin/randbid/getRandBid/${productId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch rand bids: ${error.message}`);
    }
  };