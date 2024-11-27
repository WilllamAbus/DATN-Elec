import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addScreenThunk } from "../../../../thunk"; 
import { ResponseScreen } from "../../../../../../services/attribute/types/screen/addScreen";

interface State {
  screen: Screen | null;
  status: "idle" | "loading" | "success" | "fail";
  isLoading: boolean;
  error: string | null; 
}

const initialState: State = {
  status: "idle",
  isLoading: false,
  error: null,
  screen: null,
};

const addScreenSlice = createSlice({
  name: "screen/add",
  initialState, 
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addScreenThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(addScreenThunk.fulfilled, (state, action: PayloadAction<ResponseScreen>) => {
        state.status = "success";
        state.isLoading = false;
        state.error = null;
        console.log(action.payload.msg);
      })
      .addCase(addScreenThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        const errorPayload = action.payload as ResponseScreen;
        state.error = errorPayload?.msg || "Lỗi thêm màn hình không thành công";
        console.log(errorPayload?.msg);
      });
  },
});

export default addScreenSlice.reducer;
