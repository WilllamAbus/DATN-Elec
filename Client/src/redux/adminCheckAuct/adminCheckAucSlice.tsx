import { createSlice,  PayloadAction } from '@reduxjs/toolkit';
import {getCheckAuctWinner , getWinnerAuctionDetailsAdmin } from './adminCheckAuctThunk'; // Adjust path as necessary
import {  CheckWinnerAll,  } from '../../types/adminCheckAuctWinner/getAllCheckWinner';
import { AuctionWinnerDetailsAdmin} from '../../types/adminCheckAuctWinner/detailCheckWinner';
// Define the initial state type
interface CheckWinnerState {
    checkWinnerAll: CheckWinnerAll[];

  confirmOrder: AuctionWinnerDetailsAdmin | null;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

// Define the initial state
const initialState: CheckWinnerState = {
    checkWinnerAll: [],
   
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
  name: 'checkWinner',
  initialState,
  reducers: {
    // Optionally define reducers here if needed
  },
  extraReducers: (builder) => {
    builder
    .addCase(getWinnerAuctionDetailsAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getWinnerAuctionDetailsAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.confirmOrder = action.payload as AuctionWinnerDetailsAdmin;  // Ensure payload is of type OrderAuctionDetail
    })
    .addCase(getWinnerAuctionDetailsAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(getCheckAuctWinner.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getCheckAuctWinner.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
   
      state.checkWinnerAll = action.payload.data.auctWinnerCheck;
   
      
      state.totalPages = action.payload.data.totalPages;
      state.currentPage = action.payload.data.currentPage;
  
    })
    .addCase(getCheckAuctWinner.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Error fetching orders';
    });
  },
});

// Export the actions and reducer

export default checkWinnerAdminsSlice.reducer;
