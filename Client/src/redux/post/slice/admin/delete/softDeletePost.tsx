import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { softDeletePostThunk } from '../../../thunk/admin/delete/softDeletePost';
import { PostResponse, PostData } from '../../../../../services/post/admin/types/softDeletePost'; 

interface PostState {
  posts: PostData[];
  status: 'idle' | 'loading' | 'success' | 'fail';
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  status: 'idle',
  error: null,
};

const softDeletePostSlice = createSlice({
  name: 'posts/softdelete',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(softDeletePostThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(softDeletePostThunk.fulfilled, (state, action: PayloadAction<PostResponse>) => {
        state.status = 'success';
        if (action.payload.success && action.payload.data) { 
          state.posts = state.posts.map(post =>
            post._id === action.payload.data?._id
              ? { ...post, status: action.payload.data.status }
              : post
          );
        }
      })
      
      .addCase(softDeletePostThunk.rejected, (state, action: PayloadAction<PostResponse | undefined>) => {
        state.status = 'fail';
        if (action.payload && action.payload.data) {
          state.error = action.payload.msg || 'Lỗi không xác định';
        } else {
          state.error = 'Lỗi không xác định';
        }
      });
      
  },
});

export default softDeletePostSlice.reducer;
