import { createAsyncThunk } from "@reduxjs/toolkit";
import { addRam } from "../../../../../../services/attribute/ram/admin/add/addRam";
import { ResponseRam, Ram } from "../../../../../../services/attribute/types/ram/addRam";

export const addRamThunk = createAsyncThunk<
  ResponseRam, 
  Ram, 
  { rejectValue: ResponseRam } 
>(
  "ram/add",
  async (ramData, { rejectWithValue }) => {
    try {
      const response = await addRam(ramData);
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
        msg: "Có lỗi xảy ra khi thêm RAM",
        status: 500,
      });
    }
  }
);
