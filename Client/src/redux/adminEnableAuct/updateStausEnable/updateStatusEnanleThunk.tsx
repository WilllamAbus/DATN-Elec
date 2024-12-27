import {  createAsyncThunk } from '@reduxjs/toolkit';
import { updateStatusEnable,  } from '../../../services/adminEnableAuct/enableService'; // Adjust path as necessary
import { StatusEnableWinner } from '../../../types/adminEnbaleAuct/updateEnableAuct'



export const updateEnableAuctStatusThunk = createAsyncThunk< StatusEnableWinner,
{ idEnale: string; stateEnable: string },
{ rejectValue: string }>(
  'enableStatus/updateChecckAuctStatusThunk',
  async ( { idEnale, stateEnable }, { rejectWithValue }) => {
    try {
      const response = await updateStatusEnable(idEnale, stateEnable);

      
      return response; // Return the updated order
    } catch (error) {
      return rejectWithValue('Cập nhật không thành công'); // Return the error message
    }
  }
);