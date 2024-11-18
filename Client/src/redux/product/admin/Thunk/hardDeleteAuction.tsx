import { createAsyncThunk } from '@reduxjs/toolkit';
import { hardDeleteAuction } from '../../../../services/productAuction/admin/hardDeleteAuction'; 
import { ResponseSuccess, ErrorResponse, STATUS_CODES, ERRORS,SUCCESS  } from "../../../../services/productAuction/types/hardDeleteAndRestoreAuction";

export const hardDeleteAuctionThunk = createAsyncThunk<ResponseSuccess, string, { rejectValue: ErrorResponse }>(
  'auctions/hardDelete',
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
      const response = await hardDeleteAuction(id);
      if (response.success) {
        return {
          success: true,
          err: response.err,
          msg: response.msg || SUCCESS.PRODUCT_DELETED,
          status: STATUS_CODES.SUCCESS_DELETE,
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
      console.error('Delete auction error:', error);
      return rejectWithValue({
        success: false,
        err: STATUS_CODES.SERVER_ERROR, 
        msg: ERRORS.SERVER_ERROR,
        status: STATUS_CODES.SERVER_ERROR,
      });
    }
  }
);
