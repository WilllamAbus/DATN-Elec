import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { selectCategoriesThunk } from '../Thunk';
import { SelectCategoryResponse, Category } from '../../../../services/product_v2/admin/types/select/category';

interface CategoryState {
  categories: Category[];
  status: 'idle' | 'loading' | 'success' | 'fail';
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  status: 'idle',
  error: null,
};

const selectCategoriesSlice = createSlice({
  name: 'categories/select',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(selectCategoriesThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(selectCategoriesThunk.fulfilled, (state, action: PayloadAction<SelectCategoryResponse>) => {
        state.status = 'success';
        state.categories = action.payload.selectCategories; 
      })
      .addCase(selectCategoriesThunk.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'fail';
        state.error = action.payload || 'Lỗi không xác định';
      });
  },
});

export default selectCategoriesSlice.reducer;
