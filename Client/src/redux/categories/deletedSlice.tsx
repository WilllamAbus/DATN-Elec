import { createSlice } from '@reduxjs/toolkit';
import { 
  
    fetchDeletedCategoriesThunk,
  
  } from './categoriesThunk';

import { Category } from '../../types/Categories.d';
interface CategoriesState {
  categories: Category[];
  deletedCategories: Category[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  deletedCategories: [],
  status: 'idle',
  error: null,
};

// Thunks


// Slice
const deletedCateSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeletedCategoriesThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDeletedCategoriesThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.deletedCategories = action.payload; // Update deleted categories
      })
      .addCase(fetchDeletedCategoriesThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch deleted categories';
      });
  },
});

export default deletedCateSlice.reducer;
