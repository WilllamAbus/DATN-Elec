import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllColorThunk } from "../Thunk";  
import { GetAllColorResponse, initialColorState } from "../../../../services/product_v2/types/attributes/getAllColor";

const getAllColorSlice = createSlice({
  name: "colorClient/getAllColor",
  initialState: initialColorState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllColorThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(
        getAllColorThunk.fulfilled,
        (state, action: PayloadAction<GetAllColorResponse>) => {
          state.status = "success"; 
          state.isLoading = false;
          state.colors = action.payload.colors; 
        }
      )
      .addCase(getAllColorThunk.rejected, (state, action) => {
        state.status = "fail"; 
        state.isLoading = false;
        state.error = action.payload as string || "Lỗi không xác định";
      });
  },
});

export default getAllColorSlice.reducer;
