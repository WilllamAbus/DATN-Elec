// src/thunks/categoriesThunk.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  createCategory, 
  getAllCategories, 
  getCategoryById, 
  updateCategory, 
  deleteCategory ,
  deleteListCate,
  sofDeleteCategory,
  restore,
  ApiResponse,
  checkCategoryExists
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
        const name = formData.get('name');
      
        // Check if category already exists
        const exists = await checkCategoryExists(name);
        if (exists) {
          return rejectWithValue('Category already exists');
        }
  
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





// Soft Delete Category Thunk
export const softDeleteCategoryThunk = createAsyncThunk<Category, string>(
  'categories/softDeleteCategory',
  async (categoryId: string) => {
    const response = await sofDeleteCategory(categoryId);
    return response;  // This should be the full Category object
  }
);

export const fetchDeletedCategoriesThunk = createAsyncThunk<Category[]>(
  'categories/fetchDeletedCategories',
  async () => {
    try {
      const response: ApiResponse = await deleteListCate();
      return response.data; // Ensure this is Category[]
    } catch (error) {
      console.error('Error fetching categories:', error);
      return []; // Return an empty array on error
    }
  }
);


export const restoreCategoryThunk = createAsyncThunk<Category, string>(
  'categories/restoreCategory',
  async (categoryId: string) => {
    const response = await restore(categoryId);
    return response;  // This should be the full Category object
  }
);