// src/redux/slices/timeTrackSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchTimeTracksDeletd, restoreTimeTrackAdminThunk } from './deletedTimeProdThunk';
import { TimeTrackDeleted } from '../../../types/adminTimeTrack/deletedTimeTrack';
import { TimeTrackRestore } from '../../../types/adminTimeTrack/restoreTimeTrack';
interface TimeTrackState {
  timeTrackDeletds: TimeTrackDeleted[];
  restoreTimeTrack : TimeTrackRestore[],
  timeTrackCover: TimeTrackRestore | null;
  totalPages: number;
  currentPage: number;

  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: TimeTrackState = {
    timeTrackDeletds: [],
    restoreTimeTrack: [],
    timeTrackCover: null,
    
  
  totalPages: 1,
  currentPage: 1,

  loading: false,
  error: null,
  successMessage:null
};

const timeTrackDeletedSlice = createSlice({
  name: 'timeTracks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimeTracksDeletd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeTracksDeletd.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.timeTrackDeletds = action.payload.data.timeTracks;
        state.totalPages = action.payload.data.totalPages;
        state.currentPage = action.payload.data.currentPage;
    
      })
      .addCase(fetchTimeTracksDeletd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })



      .addCase(restoreTimeTrackAdminThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(restoreTimeTrackAdminThunk.fulfilled, (state, action) => {
        state.loading = false;
        
        state.timeTrackCover = action.payload;
      
         // Thay đ��i kiểu đúng,
        // Kiểm tra softDelorder trước khi gọi filter
        // state.shippingStatus = state.shippingStatus.filter((order) => order._id !== action.payload._id);
    
        if (Array.isArray(state.timeTrackDeletds)) {
          // Remove the deleted time track from the timeTracks state
          state.timeTrackDeletds = state.timeTrackDeletds.filter(
            (track) => track._id !== action.payload._id // Filter out the deleted item
          );
        }

        if (!Array.isArray(state.restoreTimeTrack)) {
          state.restoreTimeTrack = []; // Initialize if undefined
        }
        state.restoreTimeTrack.push(action.payload);
      state.successMessage = "Xóa đơn hàng thành công";
        // state.successMessage = "Xóa đơn hàng thành công";
      })
      .addCase(restoreTimeTrackAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export default timeTrackDeletedSlice.reducer;
