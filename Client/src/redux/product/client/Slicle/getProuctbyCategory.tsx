// Slice
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getProductsByCategoryThunk } from "../Thunk";
import { GetProductsByCategoryResponse, products, Pagination } from "../types/getProuctbyCategory";

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

const getProductsByCategorySlice = createSlice({
  name: "productsClient/getProductsByCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductsByCategoryThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(
        getProductsByCategoryThunk.fulfilled,
        (state, action: PayloadAction<GetProductsByCategoryResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.products = action.payload.data.products;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(getProductsByCategoryThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || "Lỗi không xác định";
      });
  },
});

export default getProductsByCategorySlice.reducer;
