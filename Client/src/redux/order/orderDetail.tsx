import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getOrderDetailById,
  updateOrderDetailById,
  deleteOrderDetailById,
  getAllOrderDetails,
  getAllOUserOrderdetails,
} from "../../services/order/orderDetail";
import { Order, OrderItem } from "../../types/order/order";

// export const getOrderDetailByIdThunk = createAsyncThunk<
//   { order: Order[]; items: any[] },
//   string,
//   { rejectValue: string }
// >("order/getOrderDetailById", async (orderId, { rejectWithValue }) => {
//   try {
//     const response = await getOrderDetailById(orderId);
//     console.log("API response:", response);

//     // Kiểm tra cấu trúc dữ liệu trả về
//     if (!response || !response.order || !Array.isArray(response.items)) {
//       console.error("Invalid data format:", response);
//       throw new Error("Invalid data format");
//     }

//     return {
//       order: response.order,
//       items: response.items,
//     };
//   } catch (error) {
//     return rejectWithValue((error as Error).message);
//   }
// });
// Thunk to fetch order detail by ID
// orderSlice.ts
export const getOrderDetailByIdThunk = createAsyncThunk<
  { order: Order[]; items: OrderItem[] },
  string,
  { rejectValue: string }
>("order/getOrderDetailById", async (orderId, { rejectWithValue }) => {
  try {
    const response = await getOrderDetailById(orderId);
    console.log("API response:", response);

    // Kiểm tra cấu trúc dữ liệu trả về
    if (!response || !response.order || !Array.isArray(response.items)) {
      console.error("Invalid data format:", response);
      throw new Error("Invalid data format");
    }

    return {
      order: response.order,
      items: response.items,
    };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});
export const getAllOrderDetailsThunk = createAsyncThunk<
  { orderDetails: Order[] },
  void,
  { rejectValue: string }
>("orderDetail/getAllOrderDetails", async (_, { rejectWithValue }) => {
  try {
    const { data } = await getAllOrderDetails();
    return { orderDetails: data };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});
export const getAllOUserOrderdetailsThunk = createAsyncThunk<
  { orderDetails: Order[] },
  void,
  { rejectValue: string }
>("orderDetail/getAllOUserOrderdetails", async (_, { rejectWithValue }) => {
  try {
    const { data } = await getAllOUserOrderdetails();
    console.log(data);

    return { orderDetails: data };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const updateOrderDetailByIdThunk = createAsyncThunk<
  { orderDetail: Order },
  { orderDetailId: string; orderDetailData: Order },
  { rejectValue: string }
>(
  "orderDetail/updateOrderDetailById",
  async ({ orderDetailId, orderDetailData }, { rejectWithValue }) => {
    try {
      const { data } = await updateOrderDetailById(
        orderDetailId,
        orderDetailData
      );
      return { orderDetail: data };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Delete order detail by ID
export const deleteOrderDetailByIdThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "orderDetail/deleteOrderDetailById",
  async (orderDetailId, { rejectWithValue }) => {
    try {
      await deleteOrderDetailById(orderDetailId);
      return orderDetailId;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
