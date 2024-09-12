import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DeleteListProductThunk } from "../Thunk";
import { LimitDeletedListResponse, Pagination, Product } from "../types/pagi";

interface DeletedProductState {
  products: Product[];
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  pagination: Pagination | null;
}

const initialState: DeletedProductState = {
  products: [],
  status: "idle",
  error: null,
  pagination: null,
};

const deletedProductSlice = createSlice({
  name: "products/deleted",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(DeleteListProductThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        DeleteListProductThunk.fulfilled,
        (state, action: PayloadAction<LimitDeletedListResponse>) => {
          state.status = "success";
          state.products = action.payload.data.products;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(DeleteListProductThunk.rejected, (state, action) => {
        state.status = "fail";
        state.error = (action.payload as string) || "Lỗi không xác định";
      });
  },
});

export default deletedProductSlice.reducer;
