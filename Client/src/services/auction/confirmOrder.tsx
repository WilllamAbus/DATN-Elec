import instance from '../axios';
import { OrderAuctionResponse, OrderCompleteResponse} from '../../types/auctions/confirmOrder';

// Function takes userId as an argument and passes it in the request as a query parameter
export const fetchAuctionData = async (orderId: string): Promise<OrderAuctionResponse> => {
  const response = await instance.get('client/orderAuc/orderDetailAuc', {
    params: { orderId: orderId }
  });


  
  return response.data;
};

export const completeOrder = async (orderId: string): Promise<OrderCompleteResponse> => {
    const response = await instance.post('client/orderAuc/complete', { orderId });
  
  
    
    return response.data.data;
  };