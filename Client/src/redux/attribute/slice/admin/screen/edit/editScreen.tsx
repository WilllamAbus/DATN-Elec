import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { editScreenThunk } from "../../../../thunk";
import { ResponseScreen, Screen } from "../../../../../../services/attribute/types/screen/editScreen";

interface EditScreenState {
  screens: Screen[];
  status: "idle" | "loading" | "success" | "fail";
  isLoading: boolean;
  error: string | null;
}

const initialState: EditScreenState = {
  screens: [],
  status: "idle",
  isLoading: false,
  error: null,
};

const editScreenSlice = createSlice({
  name: "screen/edit",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(editScreenThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(
        editScreenThunk.fulfilled,
        (state, action: PayloadAction<ResponseScreen>) => {
          state.status = "success";
          state.isLoading = false;
          if (action.payload.screen) {
            const index = state.screens.findIndex(
              (s) => s._id === action.payload.screen?._id
            );
            // Cập nhật thông tin Screen trong danh sách
            if (index !== -1) {
              state.screens[index] = action.payload.screen;
            }
          }
          state.error = null;
          console.log(action.payload.msg);
        }
      )
      .addCase(editScreenThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        const errorPayload = action.payload as ResponseScreen;
        state.error =
          errorPayload?.msg || "Lỗi chỉnh sửa Screen không thành công";
        console.log(errorPayload?.msg);
      });
  },
});

export default editScreenSlice.reducer;
