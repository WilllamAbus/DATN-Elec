import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllScreenThunk } from "../Thunk";  
import { GetAllScreenResponse, initialScreenState } from "../../../../services/product_v2/types/attributes/getAllScreen";

const getAllScreenSlice = createSlice({
  name: "screenClient/getAllScreen",
  initialState: initialScreenState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllScreenThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(
        getAllScreenThunk.fulfilled,
        (state, action: PayloadAction<GetAllScreenResponse>) => {
          state.status = "success"; 
          state.isLoading = false;
          state.screens = action.payload.screens;
        }
      )
      .addCase(getAllScreenThunk.rejected, (state, action) => {
        state.status = "fail"; 
        state.isLoading = false;
        state.error = action.payload as string || "Lỗi không xác định";
      });
  },
});

export default getAllScreenSlice.reducer;
