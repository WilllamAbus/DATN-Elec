// biddingService.js




// biddingService.ts
import instance from '../axios';
import { DeleteBiddingRequest, AuctionResult } from '../../types/deleteBid/deleteBid';



const deleteBidding = async ({
  userId,
  biddingId,
  serviceRequestId,
  reason,
  notes,
}: DeleteBiddingRequest): Promise<AuctionResult> => {
  const response = await instance.post(`client/customer-service/delete-bidd`, {
    userId,
    biddingId,
    serviceRequestId,
    reason,
    notes,
  });
  console.log('response.data.result',response.data.result);
  return response.data.result as AuctionResult;
 
   // Return typed result
};

export default { deleteBidding };

