import { createSlice,  PayloadAction } from '@reduxjs/toolkit';
import {getEnableAuctWinner , getEnableAuctionDetailsAdmin, softDelAdminThunk } from './enableAuctThunk'; // Adjust path as necessary
import {  EnableWinnerAll,  EnableWinnerAllSoftDel} from '../../types/adminEnbaleAuct/allEnableAuct';
import { AuctionEnableDetailsAdmin} from '../../types/adminEnbaleAuct/detailEnable';
// Define the initial state type
interface CheckWinnerState {
    enableWinnerAll: EnableWinnerAll[];

  confirmOrder: AuctionEnableDetailsAdmin | null;

softDelEnableAuct: EnableWinnerAllSoftDel[];
  delEnableAuct: EnableWinnerAllSoftDel|null
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

// Define the initial state
const initialState: CheckWinnerState = {
    enableWinnerAll: [],
    softDelEnableAuct:[],
    delEnableAuct:null,
  totalPages: 1,
  currentPage: 1,
  confirmOrder: null,
  loading: false,
  error: null,
  successMessage:null
};

// ...rest of your slice code


// Define the thunk for fetching orders


// Create the slice
const checkWinnerAdminsSlice = createSlice({
  name: 'enableAuct',
  initialState,
  reducers: {
    // Optionally define reducers here if needed
  },
  extraReducers: (builder) => {
    builder
    .addCase(getEnableAuctionDetailsAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getEnableAuctionDetailsAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.confirmOrder = action.payload as AuctionEnableDetailsAdmin;  // Ensure payload is of type OrderAuctionDetail
    })
    .addCase(getEnableAuctionDetailsAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(getEnableAuctWinner.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getEnableAuctWinner.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
   
      state.enableWinnerAll = action.payload.data.auctWinnerEnable;
   
      
      state.totalPages = action.payload.data.totalPages;
      state.currentPage = action.payload.data.currentPage;
  
    })
    .addCase(getEnableAuctWinner.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Error fetching orders';
    })


       .addCase(softDelAdminThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.successMessage = null;
          })
          .addCase(softDelAdminThunk.fulfilled, (state, action) => {
            state.loading = false;
            
            state.delEnableAuct = action.payload;
          
             // Thay đ��i kiểu đúng,
            // Kiểm tra softDelorder trước khi gọi filter
            // state.shippingStatus = state.shippingStatus.filter((order) => order._id !== action.payload._id);
        
            if (Array.isArray(state.enableWinnerAll)) {
              state.softDelEnableAuct = [];
              // Remove the deleted time track from the timeTracks state
              state.enableWinnerAll = state.enableWinnerAll.filter(
                (rand) => rand._id !== action.payload._id // Filter out the deleted item
              );
            }
           
          state.softDelEnableAuct.push(action.payload);
          state.successMessage = "Xóa đơn hàng thành công";
            // state.successMessage = "Xóa đơn hàng thành công";
          })
          .addCase(softDelAdminThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          })
  },
});

// Export the actions and reducer

export default checkWinnerAdminsSlice.reducer;