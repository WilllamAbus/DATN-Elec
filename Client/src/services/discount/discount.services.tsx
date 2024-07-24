// services/discountService.ts
import axiosInstance from '../axios';
import { Discount } from '../../types/Discount.d';

export const fetchAllDiscounts = async (): Promise<Discount[]> => {
  const response = await axiosInstance.get('/getAllDiscount');
  return response.data;
};

 // Import your axios instance

export const getDiscountById = async (id: string): Promise<Discount> => {
  const response = await axiosInstance.get(`/getDiscount/${id}`);
  return response.data;
};

export const createDiscount = async (newDiscount: Discount): Promise<Discount> => {
  const response = await axiosInstance.post('/addDiscount', newDiscount);
  return response.data;
};

export const updateDiscount = async (id: string, updatedDiscount: Discount): Promise<Discount> => {
  const response = await axiosInstance.put(`/updateDiscount/${id}`, updatedDiscount);
  return response.data;
};

export const deleteDiscount = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/deleteDiscount/${id}`);
};
