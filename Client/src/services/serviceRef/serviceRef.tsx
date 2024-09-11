
import { Service } from '../../types/bidding/bidding';
import instance from '../axios';
export const fetchServices = async (): Promise<Service[]> => {
  const response = await instance.get('/services');
  return response.data.data;
};