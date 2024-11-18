import { createAsyncThunk } from '@reduxjs/toolkit';
import { softDeleteCategoryPost } from '../../../../../services/post/admin/delete/softDeleteCategoryPost';
import { SoftDeleteResponse } from '../../../../../services/post/admin/types/CategoryPost';

export const softDeleteCategoryPostThunk = createAsyncThunk<SoftDeleteResponse, string, { rejectValue: SoftDeleteResponse }>(
  'categoryPosts/softDelete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await softDeleteCategoryPost(id);
      if (response.success) {
        return response;
      } else {
        return rejectWithValue({
          success: response.success,
          err: response.err,
          msg: response.msg,
          status: response.status,
          data: undefined
        });
      }
    } catch (error: any) {
      return rejectWithValue({
        success: false,
        err: 1,
        msg: error.message || 'Lỗi không xác định',
        status: 500,
        data: undefined
      });
    }
  }
);
