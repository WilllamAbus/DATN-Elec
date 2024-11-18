import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllProductVariantsByVariantPriceThunk } from "../Thunk";
import { GetAllProductVariantsByVariantPriceResponse } from "../../../../services/detailProduct/types/getAllProductVariantsByVariantPrice";

interface ProductVariantsState {
  productVariantsList: GetAllProductVariantsByVariantPriceResponse['data'] | null;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}

// Khởi tạo state ban đầu
const initialState: ProductVariantsState = {
  productVariantsList: null,
  status: "idle",
  error: null,
  isLoading: false,
};

// Tạo Slice cho `getAllProductVariantsByVariantPrice`
const getAllProductVariantsByVariantPriceSlice = createSlice({
  name: "productClient/getAllProductVariantsByVariantPrice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProductVariantsByVariantPriceThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getAllProductVariantsByVariantPriceThunk.fulfilled,
        (
          state,
          action: PayloadAction<GetAllProductVariantsByVariantPriceResponse>
        ) => {
          state.status = "success";
          state.isLoading = false;
          state.productVariantsList = action.payload.data;
          state.error = null;
        }
      )
      .addCase(getAllProductVariantsByVariantPriceThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || "Error fetching product variants list";
      });
  },
});

export default getAllProductVariantsByVariantPriceSlice.reducer;
