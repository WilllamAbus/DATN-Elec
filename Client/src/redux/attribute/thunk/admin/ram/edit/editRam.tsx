import { createAsyncThunk } from "@reduxjs/toolkit";
import { editRam } from "../../../../../../services/attribute/ram/admin/edit/editRam";
import { ResponseRam, Ram } from "../../../../../../services/attribute/types/ram/editRam";

// Thunk để chỉnh sửa thông tin RAM
export const editRamThunk = createAsyncThunk<
  ResponseRam, // Kiểu dữ liệu trả về
  { ramId: string; updates: Partial<Ram> }, // Tham số đầu vào
  { rejectValue: ResponseRam } // Kiểu dữ liệu khi reject
>(
  "ram/edit",
  async ({ ramId, updates }, { rejectWithValue }) => {
    try {
      const response = await editRam(ramId, updates);
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
        msg: "Có lỗi xảy ra khi chỉnh sửa RAM",
        status: 500,
      });
    }
  }
);
