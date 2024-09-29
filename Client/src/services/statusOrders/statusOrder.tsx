// services/orderService.ts
import axios from '../axios';
import { ApiResponseShipping } from '../../types/iterationOrder/shippingStatusOrder';
import {  ApiResponseAll } from '../../types/iterationOrder/allOrderStatus';
import { ApiResponseReceve } from '../../types/iterationOrder/reciveStatusOrder';
import { ApiResponseComplete } from '../../types/iterationOrder/completeStatusOrder';
import {SoftDeleteOrderResponse  } from '../../types/iterationOrder/softDeleteForUser';
export const shippingStatusOrder = async (userId: string): Promise<ApiResponseShipping> => {
  try {
    const response = await axios.get('client/iteracOder/shippStateOrderAuc', {
      params: { userId: userId }
    });
    return response.data;
  } catch (error: any) {
    throw new Error('Error fetching order data');
  }
};



export const fetchListData = async (userId: string): Promise<ApiResponseAll> => {
  try {
    const response = await axios.get('client/iteracOder/allOrder', {
      params: { userId: userId }
    });
 
    return response.data ; 
  } catch (error: any) {
    throw new Error('Error fetching order data');
  }
};


export const statusReceve = async (userId: string): Promise<ApiResponseReceve> => {
  try {
    const response = await axios.get('client/iteracOder/reciveStateOrderAuc', {
      params: { userId: userId }
    });

    return response.data;
  } catch (error: any) {
    throw new Error('Error fetching order data');
  }
};



export const statusComplte = async (userId: string): Promise<ApiResponseComplete> => {
  try {
    const response = await axios.get('client/iteracOder/completStateOrderAuc', {
      params: {userId: userId }
    });
    return response.data;
  } catch (error: any) {
    throw new Error('Error fetching order data');
  }
};


export const softDelOrderUser = async (orderId: string): Promise<SoftDeleteOrderResponse> => {
  try {
    const response = await axios.patch<SoftDeleteOrderResponse>('client/iteracOder/received/soft-delete', {
      params: {orderId: orderId }
    });
    return response.data;
  } catch (error: any) {
    throw new Error('Error fetching order data');
  }
};