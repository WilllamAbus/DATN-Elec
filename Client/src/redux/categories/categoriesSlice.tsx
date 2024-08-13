// src/redux/categories/categoriesSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  fetchCategoriesThunk, 
  fetchCategoryByIdThunk, 
  createCategoryThunk, 
  updateCategoryThunk, 
  deleteCategoryThunk ,
  restoreCategoryThunk,
  softDeleteCategoryThunk,
  fetchDeletedCategoriesThunk
} from './categoriesThunk';
import { Category } from '../../types/Categories.d';

interface CategoryState {
  categories: Category[];
  deletedCategories: Category[] ;
  selectedCategory: Category | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  message: string | null; // Add message state to store success or error messages
}

const initialState: CategoryState = {
  categories: [],
  deletedCategories: [] as Category[] ,
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
      })





      .addCase(fetchDeletedCategoriesThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDeletedCategoriesThunk.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.status = 'succeeded';
        state.deletedCategories = action.payload;
        state.message = null;
      })
      .addCase(fetchDeletedCategoriesThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch deleted categories';
        state.message = null;
      })
      // .addCase(restoreCategoryThunk.pending, (state) => {
      //   state.status = 'loading';
      // })
      .addCase(restoreCategoryThunk.fulfilled, (state, action: PayloadAction<Category>) => {
        state.status = 'succeeded';
        state.deletedCategories = state.deletedCategories.filter(category => category._id !== action.payload._id);
        state.categories.push(action.payload);
        state.message = null;
      })
      .addCase(restoreCategoryThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to restore category';
        state.message = null;
      })
      // .addCase(softDeleteCategoryThunk.pending, (state) => {
      //   state.status = 'loading';
      // })
      .addCase(softDeleteCategoryThunk.fulfilled, (state, action: PayloadAction<Category>) => {
        state.status = 'succeeded';
        // state.categories = state.categories.filter(category => category._id !== action.payload._id);
        if (!state.deletedCategories.find(category => category._id === action.payload._id)) {
          state.deletedCategories.push(action.payload);
        }
        // state.deletedCategories.push(action.payload);
        // state.message = 'Category soft deleted successfully';
        state.error = null;
      })
      .addCase(softDeleteCategoryThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to soft delete category';
        state.message = null;
      });
  },
});

export default categoriesSlice.reducer;