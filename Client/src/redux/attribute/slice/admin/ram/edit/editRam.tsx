import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { editRamThunk } from "../../../../thunk";
import { ResponseRam, Ram } from "../../../../../../services/attribute/types/ram/editRam";

interface EditRamState {
  rams: Ram[];
  status: "idle" | "loading" | "success" | "fail";
  isLoading: boolean;
  error: string | null;
}

const initialState: EditRamState = {
  rams: [],
  status: "idle",
  isLoading: false,
  error: null,
};

const editRamSlice = createSlice({
  name: "ram/edit",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(editRamThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(
        editRamThunk.fulfilled,
        (state, action: PayloadAction<ResponseRam>) => {
          state.status = "success";
          state.isLoading = false;
          if (action.payload.ram) {
            const index = state.rams.findIndex(
              (r) => r._id === action.payload.ram?._id
            );
            // Cập nhật thông tin RAM trong danh sách
            if (index !== -1) {
              state.rams[index] = action.payload.ram;
            }
          }
          state.error = null;
          console.log(action.payload.msg);
        }
      )
      .addCase(editRamThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        const errorPayload = action.payload as ResponseRam;
        state.error =
          errorPayload?.msg || "Lỗi chỉnh sửa RAM không thành công";
        console.log(errorPayload?.msg);
      });
  },
});

export default editRamSlice.reducer;
