import { createAsyncThunk } from '@reduxjs/toolkit';
import { selectCategories } from '../../../../services/product_v2/admin/selects/selectCategories';
import { SelectCategoryResponse } from '../../../../services/product_v2/admin/types/select/category';
export const selectCategoriesThunk = createAsyncThunk<SelectCategoryResponse, void, { rejectValue: string }>(
  'categories/select',
  async (_, { rejectWithValue }) => {
    try {
      const response = await selectCategories();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi không xác định');
    }
  }
);
