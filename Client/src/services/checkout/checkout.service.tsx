import { OrderData } from '../../types/Checkout.d';

import axiosInstance from '../axios';
export interface ApiResponse {
  softDel:  OrderData[];
}


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


  export const sofDeleteOrder = async (_id: string): Promise<{ softDel: OrderData }> => {
    try {
      const response = await axiosInstance.patch<{ softDel: OrderData }>(`/soft-deleteOrder/${_id}`);
      console.log("response", response);
      
      return response.data;  // Assume this returns the updated Category object
    } catch (error: any) {
      throw new Error(`Error deleting category: ${error.message}`);
    }
  };
  
  export const deleteListOrder = async (): Promise<ApiResponse> => {
    // Replace this with your actual API call
    const response = await axiosInstance.get('/deleted-listOder');
    const softDel = response.data.data; // Adjust this if the actual path is different
  
    // Log the data to debug the response structure
    console.log('API response data:', softDel);
  
    if (!Array.isArray(softDel)) {
      console.error('Expected data to be an array, but received:', softDel);
      return { softDel: [] }; // Return an empty array on unexpected data
    }
  
    return { softDel };// Ensure this matches the ApiResponse type
  };
  
  export const restore = async (_id: string): Promise<{ data: OrderData }> => {
    try {
      const response = await axiosInstance.patch<{ data: OrderData }>(`/restoreOrder/${_id}`);
      console.log("responese:", response);
      
      return response.data;  // Assume this returns the restored Category object
    } catch (error: any) {
      throw new Error(`Error restoring category: ${error.message}`);
    }
  };