import instance from "../axios";
const API_URL = import.meta.env.VITE_API_URL;

export const createOrder = async (orderData: any) => {
  const response = await instance.post(`${API_URL}/orders`, orderData);
  return response.data;
};

export const VnPayment = async () => {
  const response = await instance.post(`${API_URL}/payment/momo`);
  return response.data;
};
