import axios from '../axios';
// import { Order } from '../../types/adminOrder/orderAll';
import { OrderDetailAdminResponse} from '../../types/adminOrder/orderDetailAdmin';
import { OrderResponse} from '../../types/adminOrder/orderAll';
// import  { AxiosResponse } from 'axios';
// import {Order} from '../../types/adminOrder/orderUpdateStatus';

export const getAllOrders = async (page: number, pageSize: number, search: string = '' ) => {
  try {
 

    const response = await axios.get<OrderResponse>('/client/orderAuc/getAll', {
      params: {
        page,
        pageSize,
        search,
      },
    });

    
    return response.data; // Kết quả từ API
  } catch (error: any) {
    throw new Error(error.response.data.message || 'Error fetching orders');
  }
};





// Function takes userId as an argument and passes it in the request as a query parameter
export const fetchOrderDetailAdminData = async (orderId: string): Promise<OrderDetailAdminResponse> => {
  const response = await axios.get(`client/orderAuc/orderDetailAdmin/${orderId}`, {
 
  });


  
  return response.data;
};



export const updateOrderStatus = async (orderId: string, stateOrder: string) => {
  const response = await axios.put(`/client/iteracOder/updateStatus/${orderId}`, { stateOrder });
  console.log('response', response);
  
  return response.data; // Return the order data
};


