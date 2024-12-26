import axios from '../axios';
// import { Order } from '../../types/adminOrder/orderAll';
import { WinnerAuctDetailAdminResponse} from '../../types/adminCheckAuctWinner/detailCheckWinner';
import { CheckAuctWinnerResponse} from '../../types/adminCheckAuctWinner/getAllCheckWinner';
// import  { AxiosResponse } from 'axios';
// import {Order} from '../../types/adminOrder/orderUpdateStatus';

export const getAllAuctAdmin = async (page: number, pageSize: number, search: string = '' ) => {
  try {
 

    const response = await axios.get<CheckAuctWinnerResponse>('/client/auctions/allAuctWinnerCheck', {
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
export const fetAuctWinnerDetailAdminData = async (id: string): Promise<WinnerAuctDetailAdminResponse> => {
  const response = await axios.get(`client/auctions/detailAuctWinnerCheck/${id}`, {
 
  });



  
  return response.data;
};



export const updateStatusCheck = async (idWinner: string, stateCheck: string) => {
  const response = await axios.put(`/client/auctions/updatStatusCheck/${idWinner}`, { stateCheck });

  
  return response.data; // Return the order data
};









