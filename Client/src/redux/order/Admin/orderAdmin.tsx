import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  cancelOrderAdmin,
  updateStatusById,
} from "../../../services/order/OrderAdmin/orderAdmin";
import { Order } from "../../../types/order/order";

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
