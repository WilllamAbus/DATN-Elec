import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllGraphicsCardThunk } from "../Thunk";
import { GetAllGraphicsCardResponse, initialGraphicsCardState } from "../../../../services/product_v2/types/attributes/getAllGraphicsCard";

const getAllGraphicsCardSlice = createSlice({
  name: "graphicsCardClient/getAllGraphicsCard",
  initialState: initialGraphicsCardState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllGraphicsCardThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(
        getAllGraphicsCardThunk.fulfilled,
        (state, action: PayloadAction<GetAllGraphicsCardResponse>) => {
          state.status = "success"; 
          state.isLoading = false;
          state.graphicsCards = action.payload.graphicsCards; 
        }
      )
      .addCase(getAllGraphicsCardThunk.rejected, (state, action) => {
        state.status = "fail"; 
        state.isLoading = false;
        state.error = action.payload as string || "Lỗi không xác định";
      });
  },
});

export default getAllGraphicsCardSlice.reducer;
