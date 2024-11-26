import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SerializedError } from "@reduxjs/toolkit";
import { getOneRamThunk } from "../../../../thunk";
import { Ram } from "../../../../../../services/attribute/types/ram/getOneRam";

interface RamState {
  ram: Ram | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: SerializedError | null;
}

const initialState: RamState = {
  ram: null,
  status: "idle",
  error: null,
};

const getOneRamSlice = createSlice({
  name: "ram/getone",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOneRamThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getOneRamThunk.fulfilled, (state, action: PayloadAction<Ram>) => {
        state.status = "succeeded";
        state.ram = action.payload;
      })
      .addCase(
        getOneRamThunk.rejected,
        (state, action: PayloadAction<unknown, string, never, SerializedError>) => {
          state.status = "failed";
          state.error = action.error;
        }
      );
  },
});

export default getOneRamSlice.reducer;
