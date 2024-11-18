import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { selectCategoryPostThunk } from '../../../thunk';
import { SelectCategoryPostResponse, CategoryPost } from '../../../../../services/post/admin/types/selectCategoryPost';

interface CategoryPostState {
  categoryPosts: CategoryPost[];
  status: 'idle' | 'loading' | 'success' | 'fail';
  error: string | null;
}

const initialState: CategoryPostState = {
  categoryPosts: [],
  status: 'idle',
  error: null,
};

const selectCategoryPostSlice = createSlice({
  name: 'categoryPosts/select',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(selectCategoryPostThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(selectCategoryPostThunk.fulfilled, (state, action: PayloadAction<SelectCategoryPostResponse>) => {
        state.status = 'success';
        state.categoryPosts = action.payload.categoryPosts;
      })
      .addCase(selectCategoryPostThunk.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'fail';
        state.error = action.payload || 'Lỗi không xác định';
      });
  },
});

export default selectCategoryPostSlice.reducer;
