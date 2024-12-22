import instance from '../axios';
import { AuctionData} from '../../types/auctions/auctCheckout';

// Function takes userId as an argument and passes it in the request as a query parameter
export const fetchAuctionData = async ( userId: string, productId: string): Promise<AuctionData> => {
  const response = await instance.get('client/auctions/get-auction-details', {
    params: {  userId: userId , productId: productId}
  });



  
  return response.data.data;
};




// Function takes userId as an argument and passes it in the request as a query parameter
export const fetchAuctionDataAuction = async ( userId: string, productId: string): Promise<AuctionData> => {
  const response = await instance.get('client/auctions/getAuctDetails', {
    params: {  userId: userId , productId: productId}
  });



  
  return response.data.data;
};