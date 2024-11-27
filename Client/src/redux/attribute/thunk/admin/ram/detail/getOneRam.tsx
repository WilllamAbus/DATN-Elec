import { createAsyncThunk } from "@reduxjs/toolkit";
import { Ram, GetOneRamResponse } from "../../../../../../services/attribute/types/ram/getOneRam";
import { getOneRam } from "../../../../../../services/attribute/ram/admin/detail/getOneRam";

export const getOneRamThunk = createAsyncThunk<Ram, string, { rejectValue: string }>(
  "ram/getone",
  async (ramId: string, { rejectWithValue }) => {
    try {
      const response: GetOneRamResponse = await getOneRam(ramId);
      if (response.success) {
        return response.ram as Ram;
      } else {
        return rejectWithValue(response.msg);
      }
    } catch (error) {
      return rejectWithValue("Lỗi hệ thống");
    }
  }
);
