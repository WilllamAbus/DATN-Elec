import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getVariantColorsByIdThunk } from "../Thunk";
import { GetVariantColorsByIdResponse } from "../../../../services/product_v2/admin/types/getVariantColorsById";

interface VariantColorState {
  colorList: GetVariantColorsByIdResponse['data'] | null;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}

const initialState: VariantColorState = {
  colorList: null,
  status: "idle",
  error: null,
  isLoading: false,
};

const getVariantColorsByIdSlice = createSlice({
  name: "productClient/getVariantColorsById",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getVariantColorsByIdThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getVariantColorsByIdThunk.fulfilled,
        (state, action: PayloadAction<GetVariantColorsByIdResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.colorList = action.payload.data;
          state.error = null;
        }
      )
      .addCase(getVariantColorsByIdThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || "Error fetching color list";
      });
  },
});

export default getVariantColorsByIdSlice.reducer;
