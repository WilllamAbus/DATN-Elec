// orderSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  createOrderThunk,
  listOrderThunk,
  fetchUserOrdersThunk,
  cancelOrderThunk,
  getOrderByIdThunk,
  applyVoucherThunk,
  createOrdeAuctionThunk,
} from "./orderThunks";
import {
  getOrderDetailByIdThunk,
  getAllOrderDetailsThunk,
  updateOrderDetailByIdThunk,
  getAllOUserOrderdetailsThunk,
} from "./orderDetail";
import {
  cancelOrderAdminThunk,
  deleteOrderAdminThunk,
  restoreOrderAdminThunk,
  updateStatusByIdThunk,
  listSoftOrderThunk,
} from "./Admin/orderAdmin";
import {
  LimitCrudOrderResponse,
  Order,
  OrderItem,
  Pagination,
} from "../../types/order/order";

interface OrderState {
  selectedOrder: Order | null;
  selectedOrderAuction: Order | null;
  orders: Order[];

  order: Order[] | null;

  items: OrderItem[];

  pagination: Pagination | null;
  softDeletedOrders: Order[];

  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: OrderState = {
  selectedOrder: null,
  selectedOrderAuction: null,
  items: [],
  orders: [],
  order: null,
  pagination: null,
  softDeletedOrders: [],

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
      //
      .addCase(createOrdeAuctionThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        createOrdeAuctionThunk.fulfilled,
        (state, action: PayloadAction<{ order: Order }>) => {
          state.status = "succeeded";
          state.selectedOrderAuction = action.payload.order;
          state.error = null;
        }
      )
      .addCase(createOrdeAuctionThunk.rejected, (state, action) => {
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

      // .addCase(listSoftOrderThunk.pending, (state) => {
      //   state.status = "loading";
      // })
      // .addCase(
      //   listSoftOrderThunk.fulfilled,
      //   (state, action: PayloadAction<Order[]>) => {
      //     state.status = "succeeded";
      //     state.softDeletedOrders = action.payload;
      //   }
      // )
      // .addCase(listSoftOrderThunk.rejected, (state, action) => {
      //   state.status = "failed";
      //   state.error = (action.payload as string) || "An error occurred";
      // })
      .addCase(listSoftOrderThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        listSoftOrderThunk.fulfilled,
        (state, action: PayloadAction<LimitCrudOrderResponse>) => {
          state.status = "succeeded";
          state.softDeletedOrders = action.payload.data.orders;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(listSoftOrderThunk.rejected, (state, action) => {
        console.error("Error payload:", action.payload);
        state.status = "failed";
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Lỗi không xác định";
      })
      .addCase(fetchUserOrdersThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchUserOrdersThunk.fulfilled,
        (state, action: PayloadAction<LimitCrudOrderResponse>) => {
          state.status = "succeeded";
          state.orders = action.payload.data.orders;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchUserOrdersThunk.rejected, (state, action) => {
        console.error("Error payload:", action.payload);
        state.status = "failed";
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Lỗi không xác định";
      })
      // .addCase(fetchUserOrdersThunk.pending, (state) => {
      //   state.status = "loading";
      //   state.error = null;
      // })
      // .addCase(
      //   fetchUserOrdersThunk.fulfilled,
      //   (state, action: PayloadAction<{ orders: Order[] }>) => {
      //     state.status = "succeeded";
      //     state.orders = action.payload.orders;
      //     state.error = null;
      //   }
      // )
      // .addCase(fetchUserOrdersThunk.rejected, (state, action) => {
      //   state.status = "failed";
      //   state.error = (action.payload as string) || "An error occurred";
      // })

      // Xử lý cho cancelOrderThunk
      .addCase(cancelOrderThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      // .addCase(
      //   cancelOrderThunk.fulfilled,
      //   (state, action: PayloadAction<Order>) => {
      //     state.status = "succeeded";

      //     const index = state.orders.findIndex(
      //       (order) => order._id === action.payload._id
      //     );
      //     if (index !== -1) {
      //       state.orders[index] = action.payload;
      //     }
      //     state.error = null;
      //   }
      // )
      .addCase(
        cancelOrderThunk.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.status = "succeeded";

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

      .addCase(cancelOrderAdminThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        cancelOrderAdminThunk.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.status = "succeeded";

          const index = state.orders.findIndex(
            (order) => order._id === action.payload._id
          );
          if (index !== -1) {
            state.orders[index] = action.payload;
          }
          state.error = null;
        }
      )
      .addCase(cancelOrderAdminThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "An error occurred";
      })

      .addCase(updateStatusByIdThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateStatusByIdThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Cập nhật trạng thái của đơn hàng trong danh sách
        if (Array.isArray(state.orders)) {
          const existingOrder = state.orders.find(
            (order) => order._id === action.payload._id
          );
          if (existingOrder) {
            existingOrder.stateOrder = action.payload.stateOrder;
          }
        }
      })

      .addCase(updateStatusByIdThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
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
      })

      .addCase(getOrderDetailByIdThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(
        getOrderDetailByIdThunk.fulfilled,
        (
          state,
          action: PayloadAction<{ order: Order[]; items: OrderItem[] }>
        ) => {
          state.order = action.payload.order;
          state.items = action.payload.items;
        }
      )
      .addCase(getOrderDetailByIdThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Handle getAllOrderDetailsThunk
      .addCase(getAllOrderDetailsThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        getAllOrderDetailsThunk.fulfilled,
        (state, action: PayloadAction<{ orderDetails: Order[] }>) => {
          state.status = "succeeded";
          state.orders = action.payload.orderDetails;
          state.error = null;
        }
      )
      .addCase(getAllOrderDetailsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "An error occurred";
      })

      // Handle getAllOUserOrderdetailsThunk
      .addCase(getAllOUserOrderdetailsThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        getAllOUserOrderdetailsThunk.fulfilled,
        (state, action: PayloadAction<{ orderDetails: Order[] }>) => {
          state.status = "succeeded";
          state.orders = action.payload.orderDetails;
          state.error = null;
        }
      )
      .addCase(getAllOUserOrderdetailsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "An error occurred";
      })

      // Handle updateOrderDetailByIdThunk
      .addCase(updateOrderDetailByIdThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        updateOrderDetailByIdThunk.fulfilled,
        (state, action: PayloadAction<{ orderDetail: Order }>) => {
          state.status = "succeeded";
          const index = state.orders.findIndex(
            (order) => order._id === action.payload.orderDetail._id
          );
          if (index !== -1) {
            state.orders[index] = action.payload.orderDetail;
          }
          state.error = null;
        }
      )
      .addCase(updateOrderDetailByIdThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "An error occurred";
      })

      // Handle deleteOrderDetailByIdThunk
      // .addCase(deleteOrderDetailByIdThunk.pending, (state) => {
      //   state.status = "loading";
      //   state.error = null;
      // })
      // .addCase(
      //   deleteOrderDetailByIdThunk.fulfilled,
      //   (state, action: PayloadAction<string>) => {
      //     state.status = "succeeded";
      //     state.orders = state.orders.filter(
      //       (order) => order._id !== action.payload
      //     );
      //     state.error = null;
      //   }
      // )
      // .addCase(deleteOrderDetailByIdThunk.rejected, (state, action) => {
      //   state.status = "failed";
      //   state.error = (action.payload as string) || "An error occurred";
      // })

      // Xử lý thunk cho xóa đơn hàng
      .addCase(deleteOrderAdminThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteOrderAdminThunk.fulfilled,
        (state, action: PayloadAction<Order | undefined>) => {
          state.status = "succeeded";
          if (action.payload && action.payload._id) {
            state.orders = state.orders.filter(
              (order) => order._id !== action.payload?._id
            );
          }
        }
      )

      .addCase(deleteOrderAdminThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "An error occurred";
      })

      // Xử lý thunk cho khôi phục đơn hàng
      .addCase(restoreOrderAdminThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        restoreOrderAdminThunk.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.status = "succeeded";

          state.softDeletedOrders = state.softDeletedOrders.filter(
            (order) => order._id !== action.payload._id
          );

          state.orders.push(action.payload);
        }
      )
      .addCase(restoreOrderAdminThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "An error occurred";
      })
      .addCase(applyVoucherThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(applyVoucherThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { newTotalPrice } = action.payload;

        // Kiểm tra nếu selectedOrder tồn tại trước khi cập nhật
        if (state.selectedOrder) {
          state.selectedOrder.totalAmount = newTotalPrice;
        }
      })
      .addCase(applyVoucherThunk.rejected, (state, action) => {
        state.status = "failed";
        // Kiểm tra xem action.payload có tồn tại hay không, nếu không gán giá trị lỗi mặc định
        state.error = action.payload
          ? (action.payload as string)
          : "Lỗi không xác định";
      });
  },
});
export const { setPaymentStatus } = orderSlice.actions;
export default orderSlice.reducer;
