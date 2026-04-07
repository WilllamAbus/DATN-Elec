import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createOrder,
  createOrdeAuction,
  listOrder,
  fetchUserOrders,
  cancelOrder,
  getOrderById,
  applyVoucher,
} from "../../services/order/order";
import {
  ApplyVoucherResponse,
  LimitCrudOrderResponse,
  Order,
} from "../../types/order/order";

export const createOrderThunk = createAsyncThunk<
  { order: Order; message: string }, // Cập nhật kiểu dữ liệu trả về
  Order,
  { rejectValue: string }
>("order/createOrder", async (orderData: Order, { rejectWithValue }) => {
  try {
    const response = await createOrder(orderData);
    return response;
  } catch (error) {
    return rejectWithValue((error as Error).message); // Trả về lỗi nếu thất bại
  }
});
export const createOrdeAuctionThunk = createAsyncThunk<
  { order: Order; message: string }, // Cập nhật kiểu dữ liệu trả về
  Order,
  { rejectValue: string }
>("order/createOrdeAuction", async (orderData: Order, { rejectWithValue }) => {
  try {
    const response = await createOrdeAuction(orderData);
    return response;
  } catch (error) {
    return rejectWithValue((error as Error).message); // Trả về lỗi nếu thất bại
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

// export const fetchUserOrdersThunk = createAsyncThunk<
//   { orders: Order[] },
//   void,
//   { rejectValue: string }
// >("order/UserOrders", async (_, { rejectWithValue }) => {
//   try {
//     const response = await fetchUserOrders();

//     if (!response || !response.orders || !Array.isArray(response.orders)) {
//       throw new Error("Invalid data format");
//     }

//     return { orders: response.orders };
//   } catch (error) {
//     return rejectWithValue((error as Error).message);
//   }
// });
export const fetchUserOrdersThunk = createAsyncThunk<
  LimitCrudOrderResponse,
  { page: number; search?: string; stateOrder?: string },
  { rejectValue: string }
>(
  "products/UserOrders",
  async ({ page, search, stateOrder }, { rejectWithValue }) => {
    try {
      const response = await fetchUserOrders(page, search, stateOrder);
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

// export const cancelOrderThunk = createAsyncThunk<
//   Order,
//   { orderId: string },
//   { rejectValue: string }
// >("order/cancelOrder", async ({ orderId }, { rejectWithValue }) => {
//   try {
//     const response = await cancelOrder(orderId);
//     return response.order;
//   } catch (error) {
//     return rejectWithValue((error as Error).message);
//   }
// });
export const cancelOrderThunk = createAsyncThunk<
  Order,
  { orderId: string; cancelReason: string },
  { rejectValue: string }
>(
  "order/cancelOrder",
  async ({ orderId, cancelReason }, { rejectWithValue }) => {
    try {
      const response = await cancelOrder(orderId, cancelReason);
      return response.order;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
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
export const applyVoucherThunk = createAsyncThunk<
  ApplyVoucherResponse, // Kiểu dữ liệu trả về của API
  { cartId: string; voucherCode: string } // Tham số truyền vào
>("cart/applyVoucher", async ({ cartId, voucherCode }, { rejectWithValue }) => {
  try {
    const response = await applyVoucher(cartId, voucherCode);

    return response.data as ApplyVoucherResponse; // Đảm bảo rằng response trả về đúng kiểu
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});
