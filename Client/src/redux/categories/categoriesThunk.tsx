// src/thunks/categoriesThunk.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  createCategory, 
  getAllCategories, 
  getCategoryById, 
  updateCategory, 
  deleteCategory 
} from '../../services/categories/categories.service';
import { Category } from '../../types/Categories.d';

export const fetchCategoriesThunk = createAsyncThunk<Category[]>(
  'categories/fetchAll',
  async () => {
    return await getAllCategories();
  }
);

export const fetchCategoryByIdThunk = createAsyncThunk<Category, string>(
    'categories/fetchById',
    async (id: string) => {
      return await getCategoryById(id);
    }
  );;


  
// Adjust the path as needed

export const createCategoryThunk = createAsyncThunk(
    'categories/createCategory',
    async (formData: FormData, { rejectWithValue }) => {
      try {
        const result = await createCategory(formData);
        return { category: result.category, message: result.message }; // Return both category and message
      } catch (error) {
        return rejectWithValue((error as Error).message); // Return the error message
      }
    }
  );

// Add more thunks as needed


export const updateCategoryThunk = createAsyncThunk(
    'categories/updateCategory',
    async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
      try {
        const response: Category = await   updateCategory(id, formData);
        return response; // Return the entire response data
      } catch (error) {
        return rejectWithValue(
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update category'
        );
      }
    }
  );



export const deleteCategoryThunk = createAsyncThunk<{ _id: string }, string>(
    'categories/delete',
    async (id: string) => {
    await deleteCategory(id);
      return { _id: id }; // Ensure the return type matches the thunk's expected payload type
    }
  );
