import instance from "../axios";
import { Order } from "../../types/order/order";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getOrderDetailById = async (orderId: string) => {
  try {
    const response = await instance.get(
      `${API_URL}/admin/order/detail/${orderId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error fetching order detail: An unknown error occurred");
    }
  }
};
export const cancelOrderAdmin = async (orderId: string) => {
  try {
    const response = await instance.put(
      `${API_URL}/admin/order/cancel/${orderId}`
    );
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

export const getAllOrderDetails = async () => {
  try {
    const response = await instance.get(`${API_URL}/order-detail`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(
        "Error fetching all order details: An unknown error occurred"
      );
    }
  }
};
export const getAllOUserOrderdetails = async () => {
  try {
    const response = await instance.get(`${API_URL}/orderdetails/userorder`);
    console.log(response);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(
        "Error fetching all order details: An unknown error occurred"
      );
    }
  }
};
export const updateOrderDetailById = async (
  orderDetailId: string,
  orderDetailData: Order
) => {
  try {
    const response = await instance.put(
      `${API_URL}/order-detail/update/${orderDetailId}`,
      orderDetailData
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error updating order detail: An unknown error occurred");
    }
  }
};
export const deleteOrderDetailById = async (orderDetailId: string) => {
  try {
    const response = await instance.delete(
      `${API_URL}/order-detail/delete/${orderDetailId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error deleting order detail: An unknown error occurred");
    }
  }
};
