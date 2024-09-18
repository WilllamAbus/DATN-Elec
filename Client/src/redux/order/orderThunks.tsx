import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createOrder,
  listOrder,
  fetchUserOrders,
  cancelOrder,
  getOrderById,
} from "../../services/order/order";
import { Order } from "../../types/order/order";

// Tạo đơn hàng mới
export const createOrderThunk = createAsyncThunk<
  { order: Order },
  Order,
  { rejectValue: string }
>("order/createOrder", async (orderData: Order, { rejectWithValue }) => {
  try {
    const { data } = await createOrder(orderData);
    return { order: data };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const listOrderThunk = createAsyncThunk<
  { orders: Order[] },
  void,
  { rejectValue: string }
>("admin/order/listOrder", async (_, { rejectWithValue }) => {
  try {
    const response = await listOrder();

    if (!response || !response.orders || !Array.isArray(response.orders)) {
      throw new Error("Invalid data format");
    }

    return { orders: response.orders };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const fetchUserOrdersThunk = createAsyncThunk<
  { orders: Order[] },
  void,
  { rejectValue: string }
>("order/UserOrders", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchUserOrders();

    if (!response || !response.orders || !Array.isArray(response.orders)) {
      throw new Error("Invalid data format");
    }

    return { orders: response.orders };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const cancelOrderThunk = createAsyncThunk<
  Order,
  { orderId: string },
  { rejectValue: string }
>("order/cancelOrder", async ({ orderId }, { rejectWithValue }) => {
  try {
    const response = await cancelOrder(orderId);
    return response.order;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const getOrderByIdThunk = createAsyncThunk<
  { orders: Order[] },
  string,
  { rejectValue: string }
>("order/getOrderById", async (orderId, { rejectWithValue }) => {
  try {
    const response = await getOrderById(orderId);

    if (!response || !response.orders || !Array.isArray(response.orders)) {
      throw new Error("Invalid data format");
    }

    return { orders: response.orders };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});
