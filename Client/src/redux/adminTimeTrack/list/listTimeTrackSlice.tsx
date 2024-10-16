// src/redux/slices/timeTrackSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchTimeTracks , softDelTimeTrackAdminThunk} from './listTimeTrackThunk';
import { TimeTrack } from '../../../types/adminTimeTrack/listTimeTrack';
import { TimeTrackSoftDel } from '../../../types/adminTimeTrack/softDelTimeTrack';
interface TimeTrackState {
  timeTracks: TimeTrack[];
  softDelTimeTrack: TimeTrackSoftDel[];
  delTimeTracks: TimeTrackSoftDel | null;
  totalPages: number;
  currentPage: number;

  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: TimeTrackState = {
  timeTracks: [],
  softDelTimeTrack: [],
  delTimeTracks: null,
  totalPages: 1,
  currentPage: 1,

  loading: false,
  error: null,
  successMessage: null
};

const timeTrackSlice = createSlice({
  name: 'timeTracks',
  initialState,
  reducers: {
    resetState: (state) => {
      state.softDelTimeTrack = [];
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimeTracks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeTracks.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.timeTracks = action.payload.data.timeTracks;
        state.totalPages = action.payload.data.totalPages;
        state.currentPage = action.payload.data.currentPage;
    
      })
      .addCase(fetchTimeTracks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


      .addCase(softDelTimeTrackAdminThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(softDelTimeTrackAdminThunk.fulfilled, (state, action) => {
        state.loading = false;
        
        state.delTimeTracks = action.payload;
      
         // Thay đ��i kiểu đúng,
        // Kiểm tra softDelorder trước khi gọi filter
        // state.shippingStatus = state.shippingStatus.filter((order) => order._id !== action.payload._id);
    
        if (Array.isArray(state.timeTracks)) {
          // Remove the deleted time track from the timeTracks state
          state.timeTracks = state.timeTracks.filter(
            (track) => track._id !== action.payload._id // Filter out the deleted item
          );
        }

      state.softDelTimeTrack.push(action.payload);
      state.successMessage = "Xóa đơn hàng thành công";
        // state.successMessage = "Xóa đơn hàng thành công";
      })
      .addCase(softDelTimeTrackAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export default timeTrackSlice.reducer;
