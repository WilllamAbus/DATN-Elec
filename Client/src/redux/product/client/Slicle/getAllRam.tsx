import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllRamThunk } from "../Thunk";
import { GetAllRamResponse, initialRamState } from "../../../../services/product_v2/types/attributes/getAllRam";
const getAllRamSlice = createSlice({
  name: "ramClient/getAllRam",
  initialState: initialRamState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllRamThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(
        getAllRamThunk.fulfilled,
        (state, action: PayloadAction<GetAllRamResponse>) => {
          state.status = "success"; 
          state.isLoading = false;
          state.rams = action.payload.rams;
        }
      )
      .addCase(getAllRamThunk.rejected, (state, action) => {
        state.status = "fail"; 
        state.isLoading = false;
        state.error = action.payload as string || "Lỗi không xác định";
      });
  },
});

export default getAllRamSlice.reducer;
