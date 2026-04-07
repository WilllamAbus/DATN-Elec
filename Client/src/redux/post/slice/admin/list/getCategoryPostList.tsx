
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCategoryPostListThunk } from "../../../thunk";
import { Category, Pagination, CategoryPostResponse } from "../../../../../services/post/admin/types/listCategoryPost";

interface CategoryPostState {
  categories: Category[];
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  pagination: Pagination | null;
  total:number|null;
}

const initialState: CategoryPostState = {
  categories: [],
  status: "idle",
  error: null,
  pagination: null,
  total: null,
};

const listCategoryPostSlice = createSlice({
  name: "categoryPosts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategoryPostListThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getCategoryPostListThunk.fulfilled,
        (state, action: PayloadAction<CategoryPostResponse>) => {
          state.status = "success";
          state.categories = action.payload.data.categories;
          state.pagination = action.payload.pagination;
          state.total = action.payload.data.total;
        }
      )
      .addCase(getCategoryPostListThunk.rejected, (state, action) => {
        state.status = "fail";
        state.error = (action.payload as string) || "Lỗi không xác định";
      });
  },
});

export default listCategoryPostSlice.reducer;
