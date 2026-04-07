import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllOperatingSystemThunk } from "../Thunk";
import { GetAllOperatingSystemResponse, initialOperatingSystemState } from "../../../../services/product_v2/types/attributes/getAllOperatingSystem";

const getAllOperatingSystemSlice = createSlice({
  name: "operatingSystemClient/getAllOperatingSystem",
  initialState: initialOperatingSystemState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllOperatingSystemThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(
        getAllOperatingSystemThunk.fulfilled,
        (state, action: PayloadAction<GetAllOperatingSystemResponse>) => {
          state.status = "success"; 
          state.isLoading = false;
          state.operatingSystems = action.payload.operatingSystems; 
        }
      )
      .addCase(getAllOperatingSystemThunk.rejected, (state, action) => {
        state.status = "fail"; 
        state.isLoading = false;
        state.error = action.payload as string || "Lỗi không xác định";
      });
  },
});

export default getAllOperatingSystemSlice.reducer;
