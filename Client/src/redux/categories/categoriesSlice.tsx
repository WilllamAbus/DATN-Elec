// src/redux/categories/categoriesSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  fetchCategoriesThunk, 
  fetchCategoryByIdThunk, 
  createCategoryThunk, 
  updateCategoryThunk, 
  deleteCategoryThunk 
} from './categoriesThunk';
import { Category } from '../../types/Categories.d';

interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  message: string | null; // Add message state to store success or error messages
}

const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  status: 'idle',
  error: null,
  message: null, // Initialize message state
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.status = 'succeeded';
        state.categories = action.payload;
        state.message = null; // Clear any existing message
      })
      .addCase(fetchCategoriesThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch categories';
        state.message = null; // Clear any existing message
      })
      .addCase(fetchCategoryByIdThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategoryByIdThunk.fulfilled, (state, action: PayloadAction<Category>) => {
        state.status = 'succeeded';
        state.selectedCategory = action.payload;
        state.message = null; // Clear any existing message
      })
      .addCase(fetchCategoryByIdThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch category';
        state.message = null; // Clear any existing message
      })
      .addCase(createCategoryThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createCategoryThunk.fulfilled, (state, action: PayloadAction<{ message: string, category: Category }>) => {
        state.status = 'succeeded';
        state.categories.push(action.payload.category);
        state.message = action.payload.message; // Store success message
        state.error = null; // Clear any existing error
      })
      .addCase(createCategoryThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string; // Set error message
        state.message = null; // Clear any existing message
      })
      .addCase(updateCategoryThunk.pending, (state) => {
        state.status = 'loading';
      })
  
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update the categories array with the updated category
        const updatedCategory = action.payload;
        state.categories = state.categories.map(category =>
          category._id === updatedCategory._id ? updatedCategory : category
        );
      })
      .addCase(updateCategoryThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(deleteCategoryThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, action: PayloadAction<{ _id: string }>) => {
        state.status = 'succeeded';
        state.categories = state.categories.filter(category => category._id !== action.payload._id);
        state.message = null; // Clear any existing message
        state.error = null; // Clear any existing error
      })
      .addCase(deleteCategoryThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete category';
        state.message = null; // Clear any existing message
      });
  },
});

export default categoriesSlice.reducer;
