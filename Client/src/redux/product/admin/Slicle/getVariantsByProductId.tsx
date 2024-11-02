import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getVariantsByProductIdThunk } from "../Thunk";
import { VariantsResponse,Pagination } from "../../../../services/product_v2/admin/types/getVariantByProductId";

interface VariantState {
  variantList: VariantsResponse['data'] | null;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
  pagination: Pagination | null;
}

const initialState: VariantState = {
  variantList: null,
  status: "idle",
  error: null,
  isLoading: false,
  pagination: null,
};

const getVariantsByProductIdSlice = createSlice({
  name: "productClient/getVariantsByProductId",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getVariantsByProductIdThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getVariantsByProductIdThunk.fulfilled,
        (state, action: PayloadAction<VariantsResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.variantList = action.payload.data;
          state.pagination = action.payload.pagination;
          state.error = null;
        }
      )
      .addCase(getVariantsByProductIdThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || "Error fetching variant list";
      });
  },
});

export default getVariantsByProductIdSlice.reducer;
