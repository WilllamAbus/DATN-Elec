import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateProductV2 } from "../../../../services/product_v2/admin";
import { reponseProduct, Product } from "../../../../services/product_v2/admin/types/add-product";

export const update = createAsyncThunk<
  reponseProduct, 
  { id: string; product: Product },
  { rejectValue: reponseProduct } 
>(
  "product/update",
  async ({ id, product }, { rejectWithValue }) => {
    try {
      const response = await updateProductV2(id, product);
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
        msg: "Lỗi khi cập nhật sản phẩm",
        status: 500,
      });
    }
  }
);
