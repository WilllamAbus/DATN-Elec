import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createOrder,
  listOrder,
  fetchUserOrders,
  cancelOrder,
  pendingOrders,
  ConfirmOrders,
  shippingOrders,
  CompletedOrders,
  CancelOrders,
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

// Lấy danh sách đơn hàng
export const listOrderThunk = createAsyncThunk<
  { orders: Order[] },
  void,
  { rejectValue: string }
>("order/listOrder", async (_, { rejectWithValue }) => {
  try {
    const { data } = await listOrder();
    return { orders: data };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});
export const fetchUserOrdersThunk = createAsyncThunk<
  { orders: Order[] }, // Kết quả trả về
  void, // Không có tham số đầu vào
  { rejectValue: string } // Giá trị trả về khi lỗi
>("order/UserOrders", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchUserOrders();

    // Kiểm tra cấu trúc dữ liệu trả về
    if (!response || !response.orders || !Array.isArray(response.orders)) {
      throw new Error("Invalid data format");
    }

    return { orders: response.orders }; // Trả về đúng kiểu dữ liệu
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});
export const cancelOrderThunk = createAsyncThunk<
  Order, // Kết quả trả về là đối tượng Order đã được cập nhật
  { orderId: string }, // Tham số đầu vào là ID của đơn hàng
  { rejectValue: string } // Giá trị trả về khi lỗi
>("order/cancelOrder", async ({ orderId }, { rejectWithValue }) => {
  try {
    const response = await cancelOrder(orderId);
    return response.order; // Đảm bảo trả về đúng kiểu dữ liệu
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});
export const pendingOrdersThunk = createAsyncThunk<
  { orders: Order[] },
  void,
  { rejectValue: string }
>("order/pendingOrders", async (_, { rejectWithValue }) => {
  try {
    const response = await pendingOrders();
    console.log("pendingOrders", response);

    if (!response || !response.orders || !Array.isArray(response.orders)) {
      throw new Error("Invalid data format");
    }

    return { orders: response.orders };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});
export const ConfirmOrdersThunk = createAsyncThunk<
  { orders: Order[] },
  void,
  { rejectValue: string }
>("order/ConfirmOrders", async (_, { rejectWithValue }) => {
  try {
    const response = await ConfirmOrders();
    console.log("pendingOrders", response);

    if (!response || !response.orders || !Array.isArray(response.orders)) {
      throw new Error("Invalid data format");
    }

    return { orders: response.orders };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});
export const shippingOrdersThunk = createAsyncThunk<
  { orders: Order[] },
  void,
  { rejectValue: string }
>("order/shippingOrders", async (_, { rejectWithValue }) => {
  try {
    const response = await shippingOrders();
    console.log("shippingOrders", response);

    if (!response || !response.orders || !Array.isArray(response.orders)) {
      throw new Error("Invalid data format");
    }

    return { orders: response.orders };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});
export const CompletedOrdersThunk = createAsyncThunk<
  { orders: Order[] },
  void,
  { rejectValue: string }
>("order/CompletedOrders", async (_, { rejectWithValue }) => {
  try {
    const response = await CompletedOrders();
    console.log("CompletedOrders", response);

    if (!response || !response.orders || !Array.isArray(response.orders)) {
      throw new Error("Invalid data format");
    }

    return { orders: response.orders };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});
export const getCancelOrdersThunk = createAsyncThunk<
  { orders: Order[] },
  void,
  { rejectValue: string }
>("order/CancelOrders ", async (_, { rejectWithValue }) => {
  try {
    const response = await CancelOrders();
    console.log("CancelOrders ", response);

    if (!response || !response.orders || !Array.isArray(response.orders)) {
      throw new Error("Invalid data format");
    }

    return { orders: response.orders };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});
export const getOrderByIdThunk = createAsyncThunk<
  { orders: Order[] },
  string,
  { rejectValue: string }
>("order/getOrderById ", async (orderId, { rejectWithValue }) => {
  try {
    const response = await getOrderById(orderId);
    console.log("CancelOrders ", response);

    if (!response || !response.orders || !Array.isArray(response.orders)) {
      throw new Error("Invalid data format");
    }

    return { orders: response.orders };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});
