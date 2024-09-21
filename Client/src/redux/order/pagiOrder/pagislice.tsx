import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchPaginatedOrder } from "./pagination";

import {
  LimitCrudOrderResponse,
  Pagination,
  Order,
} from "../../../types/order/order";

interface OrderState {
  orders: Order[];
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  pagination: Pagination | null;
}

const initialState: OrderState = {
  orders: [],
  status: "idle",
  error: null,
  pagination: null,
};

const paginatedOrderSlice = createSlice({
  name: "Order/paginated",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchPaginatedOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchPaginatedOrder.fulfilled,
        (state, action: PayloadAction<LimitCrudOrderResponse>) => {
          state.status = "success";
          state.orders = action.payload.data.orders;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchPaginatedOrder.rejected, (state, action) => {
        console.error("Error payload:", action.payload);
        state.status = "fail";
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Lỗi không xác định";
      });
  },
});

export default paginatedOrderSlice.reducer;
