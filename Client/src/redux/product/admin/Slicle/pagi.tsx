import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchPaginatedProducts } from "../Thunk";
import { LimitCrudProductResponse, Pagination, Product } from "../types/pagi";

interface ProductState {
  products: Product[];
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  pagination: Pagination | null;
}

const initialState: ProductState = {
  products: [],
  status: "idle",
  error: null,
  pagination: null,
};

const paginatedProductSlice = createSlice({
  name: "products/paginated",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaginatedProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchPaginatedProducts.fulfilled,
        (state, action: PayloadAction<LimitCrudProductResponse>) => {
          state.status = "success";
          state.products = action.payload.data.products;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchPaginatedProducts.rejected, (state, action) => {
        console.error("Error payload:", action.payload);
        state.status = "fail";
        state.error = typeof action.payload === 'string' ? action.payload : "Lỗi không xác định";
      });
      
  },
});

export default paginatedProductSlice.reducer;
