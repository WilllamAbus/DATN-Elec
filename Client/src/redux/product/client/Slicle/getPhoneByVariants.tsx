import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getPhoneByVariantsThunk } from "../Thunk";
import { GetPhoneVariantsResponse,Pagination } from "../../../../services/home/types/getPhoneByVariants";

interface PhoneVariantState {
  phoneVariants: GetPhoneVariantsResponse['data'] | null;
   pagination: Pagination | null;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}

const initialState: PhoneVariantState = {
  phoneVariants: null,
  pagination: null,
  status: "idle",
  error: null,
  isLoading: false,
};

const getPhoneByVariantsSlice = createSlice({
  name: "productClient/getPhoneByVariants",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPhoneByVariantsThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getPhoneByVariantsThunk.fulfilled,
        (state, action: PayloadAction<GetPhoneVariantsResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.phoneVariants = action.payload.data;
          state.pagination = action.payload.pagination;
          state.error = null;
        }
      )
      .addCase(getPhoneByVariantsThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || "Error fetching phone variants";
      });
  },
});

export default getPhoneByVariantsSlice.reducer;
