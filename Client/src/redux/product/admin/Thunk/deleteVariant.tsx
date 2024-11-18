import { createAsyncThunk } from '@reduxjs/toolkit';
import { deleteVariant } from '../../../../services/product_v2/admin/deleteVariant'; 
import { ResponseSuccess, ResponseError, STATUS_CODES, RESPONSE_MESSAGES_CRUD } from "../../../../services/product_v2/admin/types/deleteVariant";

export const deleteVariantThunk = createAsyncThunk<ResponseSuccess, string, { rejectValue: ResponseError }>(
  'variants/deleteVariant',
  async (variantId: string, { rejectWithValue }) => {
    if (!variantId || typeof variantId !== 'string') {
      return rejectWithValue({
        success: false,
        err: STATUS_CODES.BAD_REQUEST,
        msg: RESPONSE_MESSAGES_CRUD.INVALID_PRODUCT_ID,
        status: STATUS_CODES.BAD_REQUEST,
      });
    }

    try {
      const response = await deleteVariant(variantId);
      if (response.success) {
        return {
          success: true,
          err: response.err,
          msg: RESPONSE_MESSAGES_CRUD.SUCCESS_DELETE,
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
      console.error('Delete variant error:', error);
      return rejectWithValue({
        success: false,
        err: STATUS_CODES.SERVER_ERROR, 
        msg: RESPONSE_MESSAGES_CRUD.ERROR_NOT_DEFINED,
        status: STATUS_CODES.SERVER_ERROR, 
      });
    }
  }
);
