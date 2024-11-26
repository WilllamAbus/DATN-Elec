import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { softDeleteRamThunk } from "../../../../thunk";
import { Ram, SoftDeleteRamResponse } from "../../../../../../services/attribute/types/ram/softDeleteRam";

interface SoftDeleteRamState {
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  deletedRam: Ram | null;
}

const initialState: SoftDeleteRamState = {
  status: "idle",
  error: null,
  deletedRam: null,
};

const softDeleteRamSlice = createSlice({
  name: "softDeleteRam",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(softDeleteRamThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.deletedRam = null;
      })
      .addCase(
        softDeleteRamThunk.fulfilled,
        (state, action: PayloadAction<SoftDeleteRamResponse>) => {
          state.status = "success";
          state.deletedRam = action.payload.data;
        }
      )
      .addCase(softDeleteRamThunk.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload || "Lỗi không xác định";
      });
  },
});

export default softDeleteRamSlice.reducer;
