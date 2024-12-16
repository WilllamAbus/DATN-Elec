import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  cancelOrderAdmin,
  deleteOrderAdmin,
  restoreOrderAdmin,
  updateStatusById,
  getSoftOrder,
} from "../../../services/order/OrderAdmin/orderAdmin";
import { LimitDeletedListResponse, Order } from "../../../types/order/order";

export const cancelOrderAdminThunk = createAsyncThunk<
  Order,
  { orderId: string },
  { rejectValue: string }
>("order/cancelOrderAdmin", async ({ orderId }, { rejectWithValue }) => {
  try {
    const response = await cancelOrderAdmin(orderId);
    return response.order;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});
export const updateStatusByIdThunk = createAsyncThunk<
  Order,
  { orderId: string; stateOrder: string },
  { rejectValue: string }
>(
  "order/updateStatusById",
  async ({ orderId, stateOrder }, { rejectWithValue }) => {
    try {
      const response = await updateStatusById(orderId, stateOrder); // Gọi hàm API cập nhật trạng thái đơn hàng
      return response.order;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
// Thunk để khôi phục đơn hàng
export const restoreOrderAdminThunk = createAsyncThunk<
  Order,
  { orderId: string },
  { rejectValue: string }
>("order/restoreOrderAdmin", async ({ orderId }, { rejectWithValue }) => {
  try {
    const response = await restoreOrderAdmin(orderId);
    return response.order;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// Thunk để xóa đơn hàng
export const deleteOrderAdminThunk = createAsyncThunk<
  Order,
  { orderId: string },
  { rejectValue: string }
>("order/deleteOrderAdmin", async ({ orderId }, { rejectWithValue }) => {
  try {
    const response = await deleteOrderAdmin(orderId);
    return response.data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// export const listSoftOrderThunk = createAsyncThunk<
//   Order[],
//   void,
//   { rejectValue: string }
// >("order/listSoftOrder", async (_, { rejectWithValue }) => {
//   try {
//     const response = await getSoftOrder();
//     return response.orders;
//   } catch (error) {
//     return rejectWithValue((error as Error).message);
//   }
// });
export const listSoftOrderThunk = createAsyncThunk<
  LimitDeletedListResponse,
  { page: number; search?: string; stateOrder?: string },
  { rejectValue: string }
>(
  "order/getSoftOrder",
  async ({ page, search, stateOrder }, { rejectWithValue }) => {
    try {
      const response = await getSoftOrder(page, search, stateOrder);
      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.msg);
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi không xác định");
    }
  }
);
