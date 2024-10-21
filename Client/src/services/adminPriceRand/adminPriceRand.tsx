import axios from '../axios';
import { PriceRangeResponse } from '../../types/adminPriceRand/listPricrRand';
import {PriceRangeResponseDeleted } from '../../types/adminPriceRand/deletedPriceRand';
import {PriceRandResponseAdd } from '../../types/adminPriceRand/addPriceRand';
import {PriceRandData } from '../../types/adminPriceRand/addPriceRand';
export const PriceRandService = {
  createPriceRand: async (productId: string, data: PriceRandData) => {
    try {
      const response = await axios.post('/admin/randBid/create', {
        productId,
        ...data,
      });
      return response;
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        throw new Error("Sản phẩm này đã tồn tại.");
      }
      console.error("Error while creating time track:", error);
      throw error;
    }
  },
  async getAllPriceRand(page: number, pageSize: number, search: string = ''):Promise<PriceRangeResponse> {
    const response = await axios.get<PriceRangeResponse>('/admin/randBid/getAllRandBid',{
        params: {
          page,
          pageSize,
          search,
        },
      });
    return response.data;
  },

  async deletedPricceRand(page: number, pageSize: number, search: string = '') {
    const response = await axios.get<PriceRangeResponseDeleted>('/admin/randBid/deletedRandBid',{
        params: {
          page,
          pageSize,
          search,
        },
      });
    return response.data;
  },

  async getProductBy (){
    const response = await axios.get<PriceRandResponseAdd>("/getProductBy");
    return response.data;
  },


  async softDelPriceRand  (id: string)  {
    try {
      const response = await axios.patch(`/admin/randBid/softDelRandBid/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error('Error fetching order data');
    }
  },


  async restorePriceRand  (id: string)  {
    try {
      const response = await axios.patch(`/admin/randBid/restoreRandBid/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error('Error fetching order data');
    }
  },
};
