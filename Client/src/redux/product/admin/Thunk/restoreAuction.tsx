import { createAsyncThunk } from '@reduxjs/toolkit';
import { restoreAuction } from '../../../../services/productAuction/admin/restoreAuction'; 
import { ResponseSuccess, ErrorResponse, STATUS_CODES, ERRORS, SUCCESS } from "../../../../services/productAuction/types/hardDeleteAndRestoreAuction";

export const restoreAuctionThunk = createAsyncThunk<ResponseSuccess, string, { rejectValue: ErrorResponse }>(
  'auctions/restore',
  async (id: string, { rejectWithValue }) => {
    if (!id || typeof id !== 'string') {
      return rejectWithValue({
        success: false,
        err: STATUS_CODES.BAD_REQUEST,
        msg: ERRORS.INVALID_PRODUCT_ID,
        status: STATUS_CODES.BAD_REQUEST,
      });
    }

    try {
      const response = await restoreAuction(id);
      if (response.success) {
        return {
          success: true,
          err: response.err,
          msg: response.msg || SUCCESS.PRODUCT_RESTORED,
          status: STATUS_CODES.SUCCESS,
          data: response.data || null,
        };
      } else {
        return rejectWithValue({
          success: response.success,
          err: response.err,
          msg: response.msg,
          status: response.status,
        });
      }
    } catch (error) {
      console.error('Restore auction error:', error);
      return rejectWithValue({
        success: false,
        err: STATUS_CODES.SERVER_ERROR,
        msg: ERRORS.SERVER_ERROR,
        status: STATUS_CODES.SERVER_ERROR,
      });
    }
  }
);
