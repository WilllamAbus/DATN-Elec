import { createSlice,  PayloadAction } from '@reduxjs/toolkit';
import {getOrders , getOrderAuctionDetailsAdmin } from './orderAucAdminThunk'; // Adjust path as necessary
import { OrderResponse, Order,  } from '../../types/adminOrder/orderAll';
import { OrderAuctionDetailsAdmin} from '../../types/adminOrder/orderDetailAdmin';
// Define the initial state type
interface OrdersState {
  orders: Order[];
  pagination: {
    totalOrders: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null;
  confirmOrder: OrderAuctionDetailsAdmin | null;

  loading: boolean;
  error: string | null;
}

// Define the initial state
const initialState: OrdersState = {
  orders: [],
  pagination: { 
    totalOrders: 0,
    totalPages: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
  confirmOrder: null,
  loading: false,
  error: null,
};

// ...rest of your slice code


// Define the thunk for fetching orders


// Create the slice
const orderAdminsSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Optionally define reducers here if needed
  },
  extraReducers: (builder) => {
    builder
    .addCase(getOrderAuctionDetailsAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getOrderAuctionDetailsAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.confirmOrder = action.payload as OrderAuctionDetailsAdmin;  // Ensure payload is of type OrderAuctionDetail
    })
    .addCase(getOrderAuctionDetailsAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(getOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getOrders.fulfilled, (state, action: PayloadAction<OrderResponse>) => {
      state.loading = false;
      console.log("Fetched Orders:", action.payload);
      state.orders = action.payload.orders;
      state.pagination = {
        totalOrders: action.payload.pagination.totalOrders,
        totalPages: action.payload.pagination.totalPages,
        currentPage: action.payload.pagination.currentPage,
        hasNextPage: action.payload.pagination.hasNextPage,
        hasPrevPage: action.payload.pagination.hasPrevPage,
      };
      console.log('orders', state.orders);
    })
    .addCase(getOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Error fetching orders';
    });
  },
});

// Export the actions and reducer

export default orderAdminsSlice.reducer;
