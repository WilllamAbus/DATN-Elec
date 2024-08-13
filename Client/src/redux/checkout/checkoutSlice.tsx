import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderData } from '../../types/Checkout.d';
import { fetchAllOrdersThunk, 
  addOrderThunk, 
  fetchOrderById, 
  removeOrderById,
restoreOrderThunk,
softDeleteOrderThunk,
fetchDeletedOrderThunk } from './checkoutThunk';

export interface OrderState {
  orders: OrderData[];
  deletedOrder: OrderData[] ;
  currentOrder: OrderData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  message: string | null;
}

const initialState: OrderState = {
  orders: [],
  deletedOrder: []  ,
  currentOrder: null,
  status: 'idle',
  error: null,
  message: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchAllOrdersThunk.pending, (state) => {
        state.status = 'loading';
    })
    .addCase(fetchAllOrdersThunk.fulfilled, (state, action: PayloadAction<OrderData[]>) => {
        state.status = 'succeeded';
        state.orders = action.payload;
    })
    .addCase(fetchAllOrdersThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
    })
      .addCase(addOrderThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addOrderThunk.fulfilled, (state, action: PayloadAction<OrderData>) => {
        state.status = 'succeeded';
        state.orders.push(action.payload);
      })
      .addCase(addOrderThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch order';
      })
      .addCase(removeOrderById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeOrderById.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.orders = state.orders.filter((order: OrderData) => order._id !== action.payload); // Ensure proper typing
      })
      .addCase(removeOrderById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete order';
      })



      .addCase(fetchDeletedOrderThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDeletedOrderThunk.fulfilled, (state, action: PayloadAction<OrderData[]>) => {
        state.status = 'succeeded';
        state.deletedOrder = action.payload;
        state.message = null;
      })
      .addCase(fetchDeletedOrderThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch deleted order';
        state.message = null;
      })
      // .addCase(restoreCategoryThunk.pending, (state) => {
      //   state.status = 'loading';
      // })
      .addCase(restoreOrderThunk.fulfilled, (state, action: PayloadAction<OrderData>) => {
        state.status = 'succeeded';
        if (Array.isArray(state.deletedOrder)) {
          const existingOrder = state.deletedOrder.find(order => order._id === action.payload._id);
          if (!existingOrder) {
            state.orders.push(action.payload);
          }
        } else {
          console.error('State.deletedOrder is not an array. Resetting to empty array.');
          state.deletedOrder = [action.payload];
        }
      
        state.error = null;
        // state.deletedOrder = state.deletedOrder.filter(order => order._id !== action.payload._id);
        // state.orders.push(action.payload);
        // state.message = null;
      })
      .addCase(restoreOrderThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to restore category';
        state.message = null;
      })
      // .addCase(softDeleteCategoryThunk.pending, (state) => {
      //   state.status = 'loading';
      // })
      .addCase(softDeleteOrderThunk.fulfilled, (state, action: PayloadAction<OrderData>) => {
        state.status = 'succeeded';
      
     
      
        if (Array.isArray(state.deletedOrder)) {
          const existingOrder = state.deletedOrder.find(order => order._id === action.payload._id);
          if (!existingOrder) {
            state.deletedOrder.push(action.payload);
          }
        } else {
          console.error('State.deletedOrder is not an array. Resetting to empty array.');
          state.deletedOrder = [action.payload];
        }
      
        state.error = null;
      })
      
      
      .addCase(softDeleteOrderThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to soft delete order';
      });


  },
});

export default orderSlice.reducer;
