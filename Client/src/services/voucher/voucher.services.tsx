// services/VoucherService.ts
import axiosInstance from '../axios';
import { Voucher } from '../../types/Voucher.d';

export const fetchAllVouchers = async (): Promise<Voucher[]> => {
  const response = await axiosInstance.get('/getAllVoucher');
  return response.data;
};

 // Import your axios instance

export const getVoucherById = async (id: string): Promise<Voucher> => {
  const response = await axiosInstance.get(`/getVoucher/${id}`);
  return response.data;
};

export const createVoucher = async (newVoucher: Voucher): Promise<Voucher> => {
  const response = await axiosInstance.post('/addVoucher', newVoucher);
  return response.data;
};

export const updateVoucher = async (id: string, updatedVoucher: Voucher): Promise<Voucher> => {
  const response = await axiosInstance.put(`/updateVoucher/${id}`, updatedVoucher);
  return response.data;
};

export const deleteVoucher = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/deleteVoucher/${id}`);
};
