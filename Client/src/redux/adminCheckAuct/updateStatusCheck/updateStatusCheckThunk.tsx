import {  createAsyncThunk } from '@reduxjs/toolkit';
import { updateStatusCheck,  } from '../../../services/adminCheckAuct/adminCheckAuct'; // Adjust path as necessary
import { StatusCheckAuctWinner } from '../../../types/adminCheckAuctWinner/updateStatusCheckWinner'



export const updateChecckAuctStatusThunk = createAsyncThunk< StatusCheckAuctWinner,
{ idWinner: string; stateCheck: string },
{ rejectValue: string }>(
  'checkWinnerStatus/updateChecckAuctStatusThunk',
  async ( { idWinner, stateCheck }, { rejectWithValue }) => {
    try {
      const response = await updateStatusCheck(idWinner, stateCheck);

      
      return response; // Return the updated order
    } catch (error) {
      return rejectWithValue('Cập nhật không thành công'); // Return the error message
    }
  }
);