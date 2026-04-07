// services/VoucherService.ts
import axiosInstance from '../axios';
import { Voucher } from '../../types/Voucher.d';
export interface ApiResponse {
  data:  Voucher[];
}

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



export const sofDeleteVoucher = async (_id: string): Promise<{ data: Voucher }> => {
  try {
    const response = await axiosInstance.patch<{ data:Voucher }>(`/soft-deleteVoucher/${_id}`);
    console.log("response", response);
    
    return response.data;  // Assume this returns the updated Category object
  } catch (error: any) {
    throw new Error(`Error deleting category: ${error.message}`);
  }
};

export const deleteListVoucher = async (): Promise<ApiResponse> => {
  // Replace this with your actual API call
  const response = await axiosInstance.get('/deleted-listVoucher');
  const data = response.data.data; // Adjust this if the actual path is different

  // Log the data to debug the response structure
  console.log('API response data:', data);

  if (!Array.isArray(data)) {
    console.error('Expected data to be an array, but received:', data);
    return { data: [] }; // Return an empty array on unexpected data
  }

  return { data };// Ensure this matches the ApiResponse type
};

export const restore = async (_id: string): Promise<{ data: Voucher }> => {
  try {
    const response = await axiosInstance.patch<{ data: Voucher }>(`/restoreVoucher/${_id}`);
    console.log("responese:", response);
    
    return response.data;  // Assume this returns the restored Category object
  } catch (error: any) {
    throw new Error(`Error restoring category: ${error.message}`);
  }
};