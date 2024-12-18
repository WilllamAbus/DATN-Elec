import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAccessoryByVariantsThunk } from "../Thunk";
import { GetAccessoryVariantsResponse,Pagination } from "../../../../services/home/types/getAccessoryByVariants";

interface AccessoryVariantState {
  accessoryVariants: GetAccessoryVariantsResponse['data'] | null;
   pagination: Pagination | null;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}

const initialState: AccessoryVariantState = {
  accessoryVariants: null,
  pagination: null,
  status: "idle",
  error: null,
  isLoading: false,
};

const getAccessoryByVariantsSlice = createSlice({
  name: "productClient/getPhoneByVariants",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAccessoryByVariantsThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getAccessoryByVariantsThunk.fulfilled,
        (state, action: PayloadAction<GetAccessoryVariantsResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.accessoryVariants = action.payload.data;
          state.pagination = action.payload.pagination;
          state.error = null;
        }
      )
      .addCase(getAccessoryByVariantsThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || "Error fetching phone variants";
      });
  },
});

export default getAccessoryByVariantsSlice.reducer;
