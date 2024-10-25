// src/redux/thunks/timeTrackThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TimeTrackService } from '../../../services/adminTimeTrack/adminTimeTrack';
import { TimeTrackResponse } from '../../../types/adminTimeTrack/listTimeTrack';
import { TimeTrackSoftDel } from '../../../types/adminTimeTrack/softDelTimeTrack';
interface FetchTimeTracksParams {
  page: number;
  pageSize: number;
  search?: string;
}

export const fetchTimeTracks = createAsyncThunk<TimeTrackResponse, FetchTimeTracksParams>(
  'timeTracks/fetchTimeTracks',
  async ({ page, pageSize, search = '' }, { rejectWithValue }) => {
    try {
      const response = await TimeTrackService.getAllTimeTracks(page, pageSize, search);
      return response;
    } catch (error) {
      return rejectWithValue('Error fetching time tracks');
    }
  }
);


export const softDelTimeTrackAdminThunk = createAsyncThunk<TimeTrackSoftDel , { id: string }, { rejectValue: string }>(
  'timeTrack/softDelTimeTrackAdmin',
  async ({id}, { rejectWithValue }) => {
    try {
      const response  = await TimeTrackService.softDelTimeProduct(id);
  
      
      return response.data;
    } catch (error: any) {
      // Trả về thông báo lỗi cụ thể với rejectWithValue
      return rejectWithValue('Failed to fetch order data');
    }
  }
);
