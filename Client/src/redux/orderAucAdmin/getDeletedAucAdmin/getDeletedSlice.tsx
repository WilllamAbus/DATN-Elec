import { createSlice ,PayloadAction } from '@reduxjs/toolkit';
import { getOrderDeletedThunk , restoreOrderThunk} from './getDeletedThunk';
import { OrderDeleted } from '../../../types/adminOrder/getDeletedOrder';
import {OrderRestore} from '../../../types/adminOrder/restoreOrderAucAdmin'
// Define the initial state of the slice
interface DeletedOrdersState {
  ordersRestoresCover: OrderRestore[];
  deltedOrder: OrderDeleted[];
  restoredOrder: OrderRestore | null;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

const initialState: DeletedOrdersState = {
  ordersRestoresCover: [],
  deltedOrder: [],
  restoredOrder: null,
  totalPages: 1,
  currentPage: 1,
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
    .addCase(getOrderDeletedThunk.fulfilled, (state, action: PayloadAction<any>) => {
      state.deltedOrder = action.payload.data.ordersDeleted;

    
      
      state.totalPages = action.payload.data.totalPages;
      state.currentPage = action.payload.data.currentPage;
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
      state.deltedOrder = state.deltedOrder.filter(
        (order) => order._id !== action.payload._id
      );
      state.ordersRestoresCover = [...state.ordersRestoresCover, action.payload];
      
        
    })
    .addCase(restoreOrderThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default deletedOrderAucAdminSlice.reducer;
