import { createAsyncThunk } from "@reduxjs/toolkit";
import { addProductV2 } from "../../../../services/product_v2/admin";
import { ApiResponse,ProductAdd } from "../types";
export const add = createAsyncThunk<ApiResponse<ProductAdd>, ProductAdd, { rejectValue: ApiResponse<null> }>(
  "product/add",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await addProductV2(productData);
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
        msg: "Lỗi thêm hong có được mà",
        status: 500,
      });
    }
  }
);
