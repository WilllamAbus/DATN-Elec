import { createAsyncThunk } from '@reduxjs/toolkit';
import { softDeletePost } from '../../../../../services/post/admin/delete/softDeletePost';
import { PostResponse } from '../../../../../services/post/admin/types/softDeletePost';

export const softDeletePostThunk = createAsyncThunk<PostResponse, string, { rejectValue: PostResponse }>(
  'posts/softDelete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await softDeletePost(id);
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
