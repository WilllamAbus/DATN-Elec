// src/services/timeTrack.service.ts
import axios from '../axios';
import { TimeTrackResponse } from '../../types/adminTimeTrack/listTimeTrack';
import { TimeTrackData } from '../../types/adminTimeTrack/addTimeTrack';
import {TimeTrackResponseDeleted } from '../../types/adminTimeTrack/deletedTimeTrack';
import {ProductResponseAdd} from '../../types/adminTimeTrack/addTimeTrack'
import {EditTimeTrackData} from '../../types/adminTimeTrack/editTimeTrack'

export const TimeTrackService = {
  createTimeTrack: async (productId: string, data: TimeTrackData) => {
    try {
      const response = await axios.post('/createTimeTrack', {
        productId,
        ...data,
      });
      return response;
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        throw new Error("Sản phẩm này đã tồn tại.");
      }
      console.error("Error while creating time track:", error);
      throw error;
    }
  },
  async getAllTimeTracks(page: number, pageSize: number, search: string = '') {
    const response = await axios.get<TimeTrackResponse>('/timeTrackAdmin',{
        params: {
          page,
          pageSize,
          search,
        },
      });
    return response.data;
  },

  async deletedTimeTrack(page: number, pageSize: number, search: string = '') {
    const response = await axios.get<TimeTrackResponseDeleted>('/deletedTime',{
        params: {
          page,
          pageSize,
          search,
        },
      });
    return response.data;
  },
 async getProductBy (){
    const response = await axios.get<ProductResponseAdd>("/getProductBy");
    return response.data;
  },



  async editTimeTrackAdminService  (
    id: string,
    data: EditTimeTrackData
  ) {
    try {
      const response = await axios.put<EditTimeTrackData>(`editTimeTrackAdmin/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const updatedTimeTrack = response.data;
      return updatedTimeTrack;
    } catch (error: any) {
      console.error("Error in editTimeTrack service:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "Failed to update TimeTrack");
    }
  },


  async getTimeTrackWithProductDetails(id: string) {
    try {
        const response = await axios.get(`/timeTrackById/${id}`);
  
      
        
        return response.data;
    } catch (error) {
        console.error('Error fetching TimeTrack data:', error);
        return null;
    }
},

async softDelTimeProduct  (id: string)  {
  try {
    const response = await axios.patch(`softDel/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error('Error fetching order data');
  }
},


async resotreTimeProduct  (id: string)  {
  try {
    const response = await axios.patch(`restoreTimAdmin/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error('Error fetching order data');
  }
}

}
