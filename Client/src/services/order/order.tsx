import axios from "axios";
import instance from "../axios";
import { Order } from "../../types/order/order";
const API_URL = import.meta.env.VITE_API_URL;

export const createOrder = async (orderData: Order) => {
  try {
    const response = await instance.post(`${API_URL}/order/create`, orderData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(
        "Error deleting from createOrder: An unknown error occurred"
      );
    }
  }
};
export const listOrder = async () => {
  try {
    const response = await instance.get(`${API_URL}/order/listOrder`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error fetching listOrder: An unknown error occurred");
    }
  }
};
export const fetchUserOrders = async () => {
  try {
    const response = await instance.get(`${API_URL}/order/UserOrders`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error fetching UserOrders: An unknown error occurred");
    }
  }
};
export const cancelOrder = async (orderId: string) => {
  try {
    const response = await instance.put(`${API_URL}/order/cancel/${orderId}`);
    return response.data; // Đảm bảo trả về dữ liệu đúng
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error canceling order: An unknown error occurred");
    }
  }
};
export const pendingOrders = async () => {
  try {
    const response = await instance.get(`${API_URL}/order/pendingOrders`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(
        "Error fetching pendingOrders: An unknown error occurred"
      );
    }
  }
};
export const ConfirmOrders = async () => {
  try {
    const response = await instance.get(`${API_URL}/order/ConfirmOrders`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(
        "Error fetching pendingOrders: An unknown error occurred"
      );
    }
  }
};
export const shippingOrders = async () => {
  try {
    const response = await instance.get(`${API_URL}/order/shippingOrders`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(
        "Error fetching pendingOrders: An unknown error occurred"
      );
    }
  }
};
export const CompletedOrders = async () => {
  try {
    const response = await instance.get(`${API_URL}/order/CompletedOrders`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(
        "Error fetching pendingOrders: An unknown error occurred"
      );
    }
  }
};
export const CancelOrders = async () => {
  try {
    const response = await instance.get(`${API_URL}/order/CancelOrders`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(
        "Error fetching pendingOrders: An unknown error occurred"
      );
    }
  }
};
export const getOrderById = async (orderId: string) => {
  try {
    const response = await instance.get(`${API_URL}/order/${orderId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(
        "Error fetching pendingOrders: An unknown error occurred"
      );
    }
  }
};
