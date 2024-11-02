import instance from '../axios';
import { AuctionData} from '../../types/auctions/auctCheckout';

// Function takes userId as an argument and passes it in the request as a query parameter
export const fetchAuctionData = async (productId: string): Promise<AuctionData> => {
  const response = await instance.get('client/auctions/get-auction-details', {
    params: { productId: productId }
  });

console.log('response', response);

  
  return response.data.data;
};