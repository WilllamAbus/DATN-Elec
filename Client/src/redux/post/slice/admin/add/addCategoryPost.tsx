import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addCategoryPostThunk } from "../../../thunk/admin/add/addCategoryPost"; 
import { CategoryResponse,Category } from "../../../../../services/post/admin/types/CategoryPost";

interface CategoryState {
  status: 'idle' | 'loading' | 'success' | 'fail';
  isLoading: boolean;
  error: string | null;
  categories: Category[]; 
}

const initialCategoryState: CategoryState = {
  status: 'idle',
  isLoading: false,
  error: null,
  categories: [], 
};

const addCategoryPostSlice = createSlice({
  name: "category/add",
  initialState: initialCategoryState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCategoryPostThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(addCategoryPostThunk.fulfilled, (state, action: PayloadAction<CategoryResponse>) => {
        state.status = "success";
        state.isLoading = false;
        if (action.payload.category) {
          state.categories.push(action.payload.category); 
        }
        state.error = null;
        console.log(action.payload.msg);
      })
      .addCase(addCategoryPostThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        const errorPayload = action.payload as CategoryResponse;
        state.error = errorPayload?.msg || "Lỗi thêm danh mục không thành công";
        console.log(errorPayload?.msg);
      });
  },
});

export default addCategoryPostSlice.reducer;
