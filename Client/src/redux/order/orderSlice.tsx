// orderSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createOrderThunk,
  listOrderThunk,
  fetchUserOrdersThunk,
  cancelOrderThunk,
  pendingOrdersThunk,
  ConfirmOrdersThunk,
  shippingOrdersThunk,
  CompletedOrdersThunk,
  getCancelOrdersThunk,
  getOrderByIdThunk,
} from "./orderThunks";
import { Order } from "../../types/order/order";

interface OrderState {
  selectedOrder: Order | null;
  orders: Order[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: OrderState = {
  selectedOrder: null,
  orders: [],
  status: "idle",
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setPaymentStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        createOrderThunk.fulfilled,
        (state, action: PayloadAction<{ order: Order }>) => {
          state.status = "succeeded";
          state.selectedOrder = action.payload.order;
          state.error = null;
        }
      )
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "An error occurred";
      })
      .addCase(listOrderThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        listOrderThunk.fulfilled,
        (state, action: PayloadAction<{ orders: Order[] }>) => {
          state.status = "succeeded";
          state.orders = action.payload.orders;
          state.error = null;
        }
      )
      .addCase(listOrderThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "An error occurred";
      })
      .addCase(fetchUserOrdersThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchUserOrdersThunk.fulfilled,
        (state, action: PayloadAction<{ orders: Order[] }>) => {
          state.status = "succeeded";
          state.orders = action.payload.orders;
          state.error = null;
        }
      )
      .addCase(fetchUserOrdersThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "An error occurred";
      })
      .addCase(pendingOrdersThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        pendingOrdersThunk.fulfilled,
        (state, action: PayloadAction<{ orders: Order[] }>) => {
          state.status = "succeeded";
          state.orders = action.payload.orders;
          state.error = null;
        }
      )
      .addCase(pendingOrdersThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "An error occurred";
      })

      .addCase(ConfirmOrdersThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        ConfirmOrdersThunk.fulfilled,
        (state, action: PayloadAction<{ orders: Order[] }>) => {
          state.status = "succeeded";
          state.orders = action.payload.orders;
          state.error = null;
        }
      )
      .addCase(ConfirmOrdersThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "An error occurred";
      })
      .addCase(shippingOrdersThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        shippingOrdersThunk.fulfilled,
        (state, action: PayloadAction<{ orders: Order[] }>) => {
          state.status = "succeeded";
          state.orders = action.payload.orders;
          state.error = null;
        }
      )
      .addCase(shippingOrdersThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "An error occurred";
      })

      .addCase(CompletedOrdersThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        CompletedOrdersThunk.fulfilled,
        (state, action: PayloadAction<{ orders: Order[] }>) => {
          state.status = "succeeded";
          state.orders = action.payload.orders;
          state.error = null;
        }
      )
      .addCase(CompletedOrdersThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "An error occurred";
      })

      .addCase(getCancelOrdersThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        getCancelOrdersThunk.fulfilled,
        (state, action: PayloadAction<{ orders: Order[] }>) => {
          state.status = "succeeded";
          state.orders = action.payload.orders;
          state.error = null;
        }
      )
      .addCase(getCancelOrdersThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "An error occurred";
      })

      // Xử lý cho cancelOrderThunk
      .addCase(cancelOrderThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        cancelOrderThunk.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.status = "succeeded";
          // Cập nhật trạng thái đơn hàng trong danh sách đơn hàng
          const index = state.orders.findIndex(
            (order) => order._id === action.payload._id
          );
          if (index !== -1) {
            state.orders[index] = action.payload;
          }
          state.error = null;
        }
      )
      .addCase(cancelOrderThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "An error occurred";
      })
      .addCase(getOrderByIdThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        getOrderByIdThunk.fulfilled,
        (state, action: PayloadAction<{ orders: Order[] }>) => {
          state.status = "succeeded";
          state.orders = action.payload.orders;
          state.error = null;
        }
      )
      .addCase(getOrderByIdThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});
export const { setPaymentStatus } = orderSlice.actions;
export default orderSlice.reducer;
