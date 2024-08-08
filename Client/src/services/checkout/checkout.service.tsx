import { OrderData } from '../../types/Checkout.d';

import axiosInstance from '../axios';
// const API_BASE_URL = `${environment.url}`;
export const addOrder = async (order: OrderData): Promise<OrderData> => {
    try {
      // Log the order data for debugging
      console.log('Order data being sent:', order);
  
      // Make the POST request to add the order
      const response = await axiosInstance.post('/addOrder', order);
  
      // Log the response for debugging
      console.log('Order response:', response.data);
  
      // Return the response data
      return response.data;
    } catch (error) {
      // Handle specific Axios errors
     
      
      throw new Error('Failed to add order. Please try again later.');
    }
  };



export const getAllOrders = async (): Promise<OrderData[]> => {
    try {
        const response = await axiosInstance.get('/getAllOrder');
      
        
        // Check if the response data contains success and orders fields
        if (response.data.success && Array.isArray(response.data.orders)) {
            return response.data.orders;
        } else {
            throw new Error('Invalid response structure: success field is missing or orders is not an array');
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw new Error('Failed to fetch orders');
    }
};




export const getOrderById = async (id: string) => {
    try {
      const response = await axiosInstance.get(`/getOrder/${id}`);
      console.log('respones:', response);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  };
  
  export const deleteOrderById = async (_id: string) => {
    try {
      const response = await axiosInstance.delete(`/deleteOrder/${_id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  };