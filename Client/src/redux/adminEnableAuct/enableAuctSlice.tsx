import { createSlice,  PayloadAction } from '@reduxjs/toolkit';
import {getEnableAuctWinner , getEnableAuctionDetailsAdmin } from './enableAuctThunk'; // Adjust path as necessary
import {  EnableWinnerAll,  } from '../../types/adminEnbaleAuct/allEnableAuct';
import { AuctionEnableDetailsAdmin} from '../../types/adminEnbaleAuct/detailEnable';
// Define the initial state type
interface CheckWinnerState {
    enableWinnerAll: EnableWinnerAll[];

  confirmOrder: AuctionEnableDetailsAdmin | null;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

// Define the initial state
const initialState: CheckWinnerState = {
    enableWinnerAll: [],
   
  totalPages: 1,
  currentPage: 1,
  confirmOrder: null,
  loading: false,
  error: null,
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
    });
  },
});

// Export the actions and reducer

export default checkWinnerAdminsSlice.reducer;