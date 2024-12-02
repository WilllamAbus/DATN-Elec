import instance from '../axios';
import { OrderAuctionResponse, OrderCompleteResponse} from '../../types/auctions/confirmOrder';

// Function takes userId as an argument and passes it in the request as a query parameter
export const fetchAuctionData = async (
  orderId: string,
  status: string ,
  vnpayAmou: string, vnpayBankCode: string,
  vnpayOrderInfo: string, vnpPayDate: string, 
  vnpayResponCode:string, vnpTransNo:string,
): Promise<OrderAuctionResponse> => {
  const response = await instance.get('client/orderAuc/orderDetailAuc', {
    params: { 
      orderId: orderId,
       status:status,
       vnpayAmou:vnpayAmou,
       vnpayBankCode:vnpayBankCode ,
       vnpayOrderInfo: vnpayOrderInfo,
       vnpPayDate: vnpPayDate,
       vnpayResponCode:vnpayResponCode,
       vnpTransNo:vnpTransNo}, // Spread paymentDetails as query params
  });


  return response.data;
};


export const fetchAuctionDataDef = async (
  orderIds: string,
 
): Promise<OrderAuctionResponse> => {
  const response = await instance.get('client/orderAuc/orderDetailAucDefault', {
    params: { 
      orderIds: orderIds,
      }, // Spread paymentDetails as query params
  });


  return response.data;
};
export const completeOrder = async (orderId: string): Promise<OrderCompleteResponse> => {
    const response = await instance.post('client/orderAuc/complete', { orderId });
  
  
    
    return response.data.data;
  };