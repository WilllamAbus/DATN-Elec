import axios from '../axios';
import { PriceRangeResponse } from '../../types/adminPriceRandAuct/listPriceRandAuct';
import {PriceRangeResponseDeleted } from '../../types/adminPriceRandAuct/deletePriceRandAuct';

import {PriceRandData, PriceRandResponseAdd, InboundDataResponse, } from '../../types/adminPriceRandAuct/addPriceRandAuct';
export const PriceRandService = {
  createPriceRand: async (product_randBib: string, data: PriceRandData) => {
    try {
      const response = await axios.post('/client/auctions/addRandBiidAuc', {
        product_randBib,
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
    const response = await axios.get<PriceRangeResponse>('/client/auctions/allPriceRandAuc',{
        params: {
          page,
          pageSize,
          search,
        },
      });
    return response.data;
  },

  async deletedPricceRand(page: number, pageSize: number, search: string = '') {
    const response = await axios.get<PriceRangeResponseDeleted>('/client/auctions/deleted-PriceRanAuc',{
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
      const response = await axios.patch(`/client/auctions/softDelPriceRanAuc/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error('Error fetching order data');
    }
  },


  async restorePriceRand  (id: string)  {
    try {
      const response = await axios.patch(`/client/auctions/restorePriceRanAuc/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error('Error fetching order data');
    }
  },

  async delPriceRand  (id: string)  {
    try {
      const response = await axios.delete(`/client/auctions/deletePriceRanAuc/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error('Error fetching order data');
    }
  },
};


export const getProductInbound = async (productId: string) => {
    try {
      const response = await axios.get<InboundDataResponse>(`/client/auctions/allInBound`, {
        params: { productId }, // Pass productId as a query parameter
      });

  
      return response.data;
    } catch (error) {
      console.error('Error fetching product inbound:', error);
      return null;
    }
  };