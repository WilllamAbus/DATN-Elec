import { createAsyncThunk } from "@reduxjs/toolkit";
import { editScreen } from "../../../../../../services/attribute/screeen/admin/edit/editScreen"; 
import { ResponseScreen, Screen } from "../../../../../../services/attribute/types/screen/editScreen";

// Thunk để chỉnh sửa thông tin Screen
export const editScreenThunk = createAsyncThunk<
  ResponseScreen, // Kiểu dữ liệu trả về
  { screenId: string; updates: Partial<Screen> }, // Tham số đầu vào
  { rejectValue: ResponseScreen } // Kiểu dữ liệu khi reject
>(
  "screen/edit",
  async ({ screenId, updates }, { rejectWithValue }) => {
    try {
      const response = await editScreen(screenId, updates);
      if (response.success) {
        return response;
      } else {
        return rejectWithValue({
          success: false,
          err: response.err,
          msg: response.msg,
          status: response.status,
        });
      }
    } catch (error) {
      return rejectWithValue({
        success: false,
        err: 1,
        msg: "Có lỗi xảy ra khi chỉnh sửa Screen",
        status: 500,
      });
    }
  }
);
