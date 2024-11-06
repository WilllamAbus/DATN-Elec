import instance from "../axios";
import {BiddingResponse} from "../../types/listBiddings/listBids";

export const listBiidings = async (page: number, pageSize: number, search: string = ''): Promise<BiddingResponse> => {
  try {
    const response = await instance.get<BiddingResponse>('/client/bidding/bidAlls', {
        params: {
          page,
          pageSize,
          search,
        },
  
    });
    return response.data
  } catch (error) {
    console.error("Error fetching inbounds list:", error);
    throw error;
  }
};




