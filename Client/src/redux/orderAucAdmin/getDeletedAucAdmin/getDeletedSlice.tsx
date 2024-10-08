import { createSlice ,PayloadAction } from '@reduxjs/toolkit';
import { getOrderDeletedThunk , restoreOrderThunk} from './getDeletedThunk';
import { Order , OrdersResponse} from '../../../types/adminOrder/getDeletedOrder';
import {OrderRestore} from '../../../types/adminOrder/restoreOrderAucAdmin'
// Define the initial state of the slice
interface DeletedOrdersState {
  orders: OrderRestore[];
  deletedOrders: Order[];
  restoredOrder: OrderRestore | null;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: DeletedOrdersState = {
  orders: [],
  deletedOrders: [],
  restoredOrder: null,
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
};

// Create the slice
const deletedOrderAucAdminSlice = createSlice({
  name: 'deletedOrderAucAdmin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getOrderDeletedThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getOrderDeletedThunk.fulfilled, (state, action: PayloadAction<OrdersResponse>) => {
      state.deletedOrders = action.payload.data;
    
      
      state.currentPage = action.payload.pagination.currentPage;
      state.totalPages = action.payload.pagination.totalPages;
      state.loading = false;
    })
    .addCase(getOrderDeletedThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })


    .addCase(restoreOrderThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(restoreOrderThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.restoredOrder = action.payload;

      // Filter out the restored order from deleted orders
      state.deletedOrders = state.deletedOrders.filter(
        (order) => order._id !== action.payload._id
      );
      state.orders = [...state.orders, action.payload];
      
        
    })
    .addCase(restoreOrderThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default deletedOrderAucAdminSlice.reducer;
