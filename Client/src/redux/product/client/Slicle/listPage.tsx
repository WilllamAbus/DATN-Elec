import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { listPageThunk } from "../Thunk";
import { LimitPageProductResponse, Pagination, products } from "../types/listPage";

interface ProductState {
  products: products[];
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  pagination: Pagination | null;
  isLoading: boolean;
}

const initialState: ProductState = {
  products: [],
  status: "idle",
  error: null,
  pagination: null,
  isLoading: false,
};

const listPageSlice = createSlice({
  name: "productsClient/listPage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listPageThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(
        listPageThunk.fulfilled,
        (state, action: PayloadAction<LimitPageProductResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.products = action.payload.data.products;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(listPageThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = (action.payload as string) || "Lỗi không xác định";
      });
  },
});

export default listPageSlice.reducer;
