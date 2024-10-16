// src/services/orderService.ts

import axios from '../axios';
import { OrdersResponse } from '../../types/adminOrder/getDeletedOrder';

import { RestoreOrderResponse } from "../../types/adminOrder/restoreOrderAucAdmin";

interface FetchOrdersParams {
  page?: number;
  limit?: number;
}

export const fetchDeletedOrderAuc = async ({ page = 1, limit = 5 }: FetchOrdersParams = {}): Promise<OrdersResponse> => {
  try {
    const response = await axios.get<OrdersResponse>('client/orderAuc/deleted', {
      params: {
        page,
        limit,
      },
    });
    // console.log('response', response);
    
    return response.data;
  } catch (error: any) {
    throw new Error(`Error fetching orders: ${error.message}`);
  }
};






export const restoreOrder = async (orderId: string): Promise<RestoreOrderResponse> => {
  const response = await axios.patch<RestoreOrderResponse>(`client/orderAuc/restore/${orderId}`);

  
  return response.data;
};

