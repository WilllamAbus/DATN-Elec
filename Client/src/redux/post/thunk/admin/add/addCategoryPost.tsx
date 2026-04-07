import { createAsyncThunk } from "@reduxjs/toolkit";
import { addCategoryPost } from "../../../../../services/post/admin/add/addCategoryPost"; 
import { CategoryResponse,Category } from "../../../../../services/post/admin/types/CategoryPost";

export const addCategoryPostThunk = createAsyncThunk<
  CategoryResponse, 
  Category, 
  { rejectValue: CategoryResponse }  
>(
  "category/add",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await addCategoryPost(categoryData);
      if (response.success) {
        return response; 
      } else {
        return rejectWithValue({
          success: false,
          err: response.err,
          msg: response.msg,
          status: response.status,
        });
      }
    } catch (error) {
      return rejectWithValue({
        success: false,
        err: 1,
        msg: "Lỗi thêm danh mục không thành công",
        status: 500,
      });
    }
  }
);
