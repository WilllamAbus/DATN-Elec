import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { softDeleteCategoryPostThunk } from '../../../thunk';
import { Category, SoftDeleteResponse } from '../../../../../services/post/admin/types/CategoryPost';
interface CategoryPostState {
  categories: Category[];
  status: 'idle' | 'loading' | 'success' | 'fail';
  error: string | null;
}
const initialState: CategoryPostState = {
  categories: [],
  status: 'idle',
  error: null,
};
const softDeleteCategoryPostSlice = createSlice({
  name: 'categoryPosts/softdelete',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(softDeleteCategoryPostThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(softDeleteCategoryPostThunk.fulfilled, (state, action: PayloadAction<SoftDeleteResponse>) => {
        state.status = 'success';
        if (action.payload.success && action.payload.data) { 
          state.categories = state.categories.map(category =>
            category._id === action.payload.data?._id
              ? { ...category, status: action.payload.data.status }
              : category
          );
        }
      })
      .addCase(softDeleteCategoryPostThunk.rejected, (state, action: PayloadAction<unknown>) => {
        state.status = 'fail';
        state.error = action.payload instanceof Error ? action.payload.message : 'Lỗi không xác định';
      });
  },
});

export default softDeleteCategoryPostSlice.reducer;
