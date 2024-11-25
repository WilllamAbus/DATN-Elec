import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addRamThunk } from "../../../../thunk";
import { ResponseRam,Ram } from "../../../../../../services/attribute/types/ram/addRam";

interface State {
  ram: Ram | null;
  status: "idle" | "loading" | "success" | "fail";
  isLoading: boolean;
  error: string | null;
}

const initialState: State = {
  status: "idle",
  isLoading: false,
  error: null,
  ram: null,
};

const addRamSlice = createSlice({
  name: "ram/add",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addRamThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(addRamThunk.fulfilled, (state, action: PayloadAction<ResponseRam>) => {
        state.status = "success";
        state.isLoading = false;
        state.error = null;
        state.ram = action.payload.ram || null;
        console.log(action.payload.msg);
      })
      .addCase(addRamThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        const errorPayload = action.payload as ResponseRam;
        state.error = errorPayload?.msg || "Lỗi thêm RAM không thành công";
        console.log(errorPayload?.msg);
      });
  },
});

export default addRamSlice.reducer;
