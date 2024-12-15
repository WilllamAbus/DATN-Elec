import axios from "axios";
import instance from "../../axios";
import { LimitDeletedListResponse } from "../../../types/order/order";

const API_URL = import.meta.env.VITE_API_URL;

export const cancelOrderAdmin = async (orderId: string) => {
  try {
    const response = await instance.put(
      `${API_URL}/admin/order/cancel/${orderId}`
    );
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

export const listOrder = async () => {
  try {
    const response = await instance.get(`${API_URL}/admin/order/listOrder`);
    console.log(response);

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
// export const getSoftOrder = async () => {
//   try {
//     const response = await instance.get(`${API_URL}/admin/order/getSoftOrder`);
//     console.log(response);

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
export const getSoftOrder = async (
  page: number,
  search?: string,
  stateOrder?: string
): Promise<LimitDeletedListResponse> => {
  try {
    const queryParams = new URLSearchParams({ page: page.toString() });

    if (search) {
      queryParams.append("search", search);
    }

    if (stateOrder) {
      queryParams.append("stateOrder", stateOrder);
    }

    const response = await instance.get<LimitDeletedListResponse>(
      `/admin/order/getSoftOrder/limit/?${queryParams.toString()}`
    );
    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching Order:", error);
    throw new Error("Failed to fetch Order");
  }
};

export const updateStatusById = async (orderId: string, stateOrder: string) => {
  try {
    const response = await instance.put(
      `${API_URL}/admin/order/status/${orderId}`,
      { stateOrder }
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
// Hàm xóa đơn hàng (soft delete)
export const deleteOrderAdmin = async (orderId: string) => {
  try {
    const response = await instance.delete(
      `${API_URL}/admin/order/delete/${orderId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error deleting order: An unknown error occurred");
    }
  }
};

// Hàm khôi phục đơn hàng
export const restoreOrderAdmin = async (orderId: string) => {
  try {
    const response = await instance.put(
      `${API_URL}/admin/order/restore/${orderId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error restoring order: An unknown error occurred");
    }
  }
};
