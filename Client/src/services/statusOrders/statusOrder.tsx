// services/orderService.ts
import axios from '../axios';
import { ApiResponseShipping } from '../../types/iterationOrder/shippingStatusOrder';
import {  ApiResponseAll } from '../../types/iterationOrder/allOrderStatus';
import { ApiResponseReceve } from '../../types/iterationOrder/reciveStatusOrder';
import { ApiResponseComplete } from '../../types/iterationOrder/completeStatusOrder';
import { ApiResponsePending } from '../../types/iterationOrder/pendingStatusOrder';
import { ApiResponseConfirmed } from '../../types/iterationOrder/confirmedStatusOrder';
import { DeleteOrderItearacRequest, SoftDeleteOrderData } from '../../types/iterationOrder/softDeleteForUser';
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

export const pendingStatusOrder = async (userId: string): Promise<ApiResponsePending> => {
  try {
    const response = await axios.get('client/iteracOder/pendingStateOrderAuc', {
      params: { userId: userId }
    });
    return response.data;
  } catch (error: any) {
    throw new Error('Error fetching order data');
  }
};

export const confirmedStatusOrder = async (userId: string): Promise<ApiResponseConfirmed> => {
  try {
    const response = await axios.get('client/iteracOder/confirmStateOrderAuc', {
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


export const softDelOrderUser = async (orderId: string) => {
  try {
    const response = await axios.patch(`client/iteracOder/received/soft-delete/${orderId}`);
    return response.data;
  } catch (error: any) {
    throw new Error('Error fetching order data');
  }
};






export const deleteOrderSoftMail = async ({
  userId,
  orderId,
  serviceRequestId,
  reason,
  notes,
}: DeleteOrderItearacRequest): Promise<SoftDeleteOrderData> => {
  const response = await axios.post(`client/orderAuc/softOrderByUserEmail`, {
    userId,
    orderId,
    serviceRequestId,
    reason,
    notes,
  });

  return response.data.result as SoftDeleteOrderData;
 
   // Return typed result
};