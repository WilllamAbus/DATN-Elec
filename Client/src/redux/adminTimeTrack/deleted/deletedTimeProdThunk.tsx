// src/redux/thunks/timeTrackThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TimeTrackService } from '../../../services/adminTimeTrack/adminTimeTrack';
import { TimeTrackResponseDeleted } from '../../../types/adminTimeTrack/deletedTimeTrack';
import { TimeTrackRestore } from '../../../types/adminTimeTrack/restoreTimeTrack';
interface FetchTimeTracksParams {
  page: number;
  pageSize: number;
  search?: string;
}

export const fetchTimeTracksDeletd = createAsyncThunk<TimeTrackResponseDeleted, FetchTimeTracksParams>(
  'timeTracks/fetchDeletedTimeTracks',
  async ({ page, pageSize, search = '' }, { rejectWithValue }) => {
    try {
      const response = await TimeTrackService.deletedTimeTrack(page, pageSize, search);
      return response;
    } catch (error) {
      return rejectWithValue('Error fetching time tracks');
    }
  }
);



export const restoreTimeTrackAdminThunk = createAsyncThunk<TimeTrackRestore , { id: string }, { rejectValue: string }>(
  'timeTrack/softDelTimeTrackAdmin',
  async ({id}, { rejectWithValue }) => {
    try {
      const response  = await TimeTrackService.resotreTimeProduct(id);
      console.log('softDelTimeTrack', response.data);
      
      return response.data;
    } catch (error: any) {
      // Trả về thông báo lỗi cụ thể với rejectWithValue
      return rejectWithValue('Failed to fetch order data');
    }
  }
);