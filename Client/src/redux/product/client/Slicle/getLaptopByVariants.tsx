import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getLaptopByVariantsThunk } from "../Thunk";
import { GetLaptopVariantsResponse,Pagination } from "../../../../services/home/types/getLaptopByVariants";

interface LaptopVariantState {
  laptopVariants: GetLaptopVariantsResponse['data'] | null;
   pagination: Pagination | null;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}

const initialState: LaptopVariantState = {
  laptopVariants: null,
  pagination: null,
  status: "idle",
  error: null,
  isLoading: false,
};

const getLaptopByVariantsSlice = createSlice({
  name: "productClient/getLaptopByVariants",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLaptopByVariantsThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getLaptopByVariantsThunk.fulfilled,
        (state, action: PayloadAction<GetLaptopVariantsResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.laptopVariants = action.payload.data;
          state.pagination = action.payload.pagination;
          state.error = null;
        }
      )
      .addCase(getLaptopByVariantsThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || "Error fetching phone variants";
      });
  },
});

export default getLaptopByVariantsSlice.reducer;
