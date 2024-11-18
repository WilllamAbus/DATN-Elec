import axios from "axios";
import { Bank } from "../../types/user";
import instance from "../axios";

const API_URL = import.meta.env.VITE_API_URL;
const vietqr = "https://api.vietqr.io/v2";
export const getBank = async () => {
  const response = await axios.get(`${vietqr}/banks`);
  return response.data;
};

export const addBank = async (BankData: Bank) => {
  try {
    const response = await instance.post(`${API_URL}/bank/add`, BankData);

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const listBank = async () => {
  try {
    const response = await instance.get(`${API_URL}/bank/`);

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteBanks = async (_id: string) => {
  try {
    const response = await instance.delete(`${API_URL}/bank/${_id}`);

    return response.data;
  } catch (error) {
    throw error;
  }
};
//PUT: set mặc định
export const setDefaultBank = async (id: string) => {
  try {
    const response = await instance.put(`${API_URL}/bank/default/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
