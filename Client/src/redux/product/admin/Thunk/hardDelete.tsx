  import { createAsyncThunk } from '@reduxjs/toolkit';
  import { hardDeleteProduct } from '../../../../services/product_v2/admin'; 
  import { ResponseSuccess, ResponseError, STATUS_CODES, RESPONSE_MESSAGES_CRUD } from "../../../../services/product_v2/admin/types/hardDelete";

  export const hardDeleteThunk = createAsyncThunk<ResponseSuccess, string, { rejectValue: ResponseError }>(
    'products/hardDelete',
    async (id: string, { rejectWithValue }) => {
      if (!id || typeof id !== 'string') {
        return rejectWithValue({
          success: false,
          err: STATUS_CODES.BAD_REQUEST,
          msg: RESPONSE_MESSAGES_CRUD.INVALID_VARIANT_ID,
          status: STATUS_CODES.BAD_REQUEST,
        });
      }

      try {
        const response = await hardDeleteProduct(id);
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
        console.error('Delete product error:', error);
        return rejectWithValue({
          success: false,
          err: STATUS_CODES.SERVER_ERROR, 
          msg: RESPONSE_MESSAGES_CRUD.ERROR_NOT_DEFINED,
          status: STATUS_CODES.SERVER_ERROR, 
        });
      }
    }
  );
