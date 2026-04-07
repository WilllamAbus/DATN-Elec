import { createSlice,  PayloadAction } from '@reduxjs/toolkit';
import {getOrders , getOrderAuctionDetailsAdmin } from './orderAucAdminThunk'; // Adjust path as necessary
import {  Order,  } from '../../../types/adminOrder/orderAll';
import { OrderAuctionDetailsAdmin} from '../../../types/adminOrder/orderDetailAdmin';
// Define the initial state type
interface OrdersState {
  orders: Order[];

  confirmOrder: OrderAuctionDetailsAdmin | null;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

// Define the initial state
const initialState: OrdersState = {
  orders: [],

  totalPages: 1,
  currentPage: 1,
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
    .addCase(getOrders.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
   
      state.orders = action.payload.data.ordersDeleted;
   
      
      state.totalPages = action.payload.data.totalPages;
      state.currentPage = action.payload.data.currentPage;
  
    })
    .addCase(getOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Error fetching orders';
    });
  },
});

// Export the actions and reducer

export default orderAdminsSlice.reducer;
