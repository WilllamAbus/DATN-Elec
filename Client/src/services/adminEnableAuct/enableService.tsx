import axios from '../axios';
// import { Order } from '../../types/adminOrder/orderAll';
import { EnableAuctDetailAdminResponse} from '../../types/adminEnbaleAuct/detailEnable';
import { EnableAllResponse

} from '../../types/adminEnbaleAuct/allEnableAuct';
// import  { AxiosResponse } from 'axios';
// import {Order} from '../../types/adminOrder/orderUpdateStatus';

export const getAllAuctEnableAdmin = async (page: number, pageSize: number, search: string = '' ) => {
  try {
 

    const response = await axios.get<EnableAllResponse>('/client/auctions/allAuctWinnerEnable', {
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
export const fetAuctEnableDetailAdminData = async (id: string): Promise<EnableAuctDetailAdminResponse> => {
  const response = await axios.get(`client/auctions/detailAuctWinnerEnable/${id}`, {
 
  });



  
  return response.data;
};



export const updateStatusEnable = async (idEnale: string, stateEnable: string) => {
  const response = await axios.put(`/client/auctions/updatStatusEnable/${idEnale}`, { stateEnable });

  
  return response.data; // Return the order data
};



export const softDelEnable = async (id: string) => {
    try {
      const response = await axios.patch(`/client/auctions/softEnable/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error('Error fetching order data');
    }
  };