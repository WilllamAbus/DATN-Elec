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
      throw new Error("Error creating order: An unknown error occurred");
    }
  }
};

// export const listOrder = async () => {
//   try {
//     const response = await instance.get(`${API_URL}/admin/order/listOrder`);
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       throw new Error(error.response.data.message || error.message);
//     } else if (error instanceof Error) {
//       throw new Error(error.message);
//     } else {
//       throw new Error("Error fetching listOrder: An unknown error occurred");
//     }
//   }
// };
export const listOrder = async (page = 1, limit = 10) => {
  try {
    const response = await instance.get(`${API_URL}/admin/order/listOrder`, {
      params: { page, limit },
    });
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

// export const cancelOrder = async (orderId: string) => {
//   try {
//     const response = await instance.put(`${API_URL}/order/cancel/${orderId}`);
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       throw new Error(error.response.data.message || error.message);
//     } else if (error instanceof Error) {
//       throw new Error(error.message);
//     } else {
//       throw new Error("Error canceling order: An unknown error occurred");
//     }
//   }
// };
export const cancelOrder = async (orderId: string, cancelReason: string) => {
  try {
    const response = await instance.put(`${API_URL}/order/cancel/${orderId}`, {
      cancelReason, // Gửi lý do hủy qua body
    });
    return response.data;
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
      throw new Error("Error fetching order by ID: An unknown error occurred");
    }
  }
};
export const applyVoucher = async (cartId: string, voucherCode: string) => {
  try {
    const response = await instance.post(`${API_URL}/order/apply-voucher`, {
      cartId,
      voucherCode,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error fetching order by ID: An unknown error occurred");
    }
  }
};
