import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { softDeleteScreenThunk } from "../../../../thunk";
import { Screen,SoftDeleteScreenResponse } from "../../../../../../services/attribute/types/screen/softDeleteScreen";

interface SoftDeleteScreenState {
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  deletedScreen: Screen | null;
}

const initialState: SoftDeleteScreenState = {
  status: "idle",
  error: null,
  deletedScreen: null,
};

const softDeleteScreenSlice = createSlice({
  name: "softDeleteScreen",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(softDeleteScreenThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.deletedScreen = null;
      })
      .addCase(
        softDeleteScreenThunk.fulfilled,
        (state, action: PayloadAction<SoftDeleteScreenResponse>) => {
          state.status = "success";
          state.deletedScreen = action.payload.data;
        }
      )
      .addCase(softDeleteScreenThunk.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload || "Lỗi không xác định";
      });
  },
});

export default softDeleteScreenSlice.reducer;
