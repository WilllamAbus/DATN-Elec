// services/timeTrackProduct/timeTrackProd.ts
import instance from '../axios';
import { ProductResponse } from '../../types/timeTrackProduct/timeTrackProduct';

export const getProductByTimeTrack = async (productId: string): Promise<ProductResponse> => {
    const response = await instance.get(`/producuByTimeTrack/${productId}`);
   
      return response.data;
  };




  