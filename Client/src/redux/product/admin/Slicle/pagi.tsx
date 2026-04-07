import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchPaginatedProducts } from "../Thunk";
import { LimitCrudProductResponse, Pagination, Product, Variant } from "../../../../services/product_v2/admin/types/pagination";

interface ProductState {
  products: Product[];
  variants:Variant[]
  total:number|null;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  pagination: Pagination | null;
}

const initialState: ProductState = {
  products: [],
  variants:[],
  status: "idle",
  error: null,
  total: null,
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
          state.total = action.payload.data.total;
          state.variants = action.payload.data.variants;
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
