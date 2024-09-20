import { createAsyncThunk } from "@reduxjs/toolkit";
import { addVariant } from "../../../../services/product_v2/admin";
import { ProductVariantResponse, ProductVariant } from "../types/addVariant";

export const addVariantThunk = createAsyncThunk<
  ProductVariantResponse<ProductVariant>,
  { productId: string; variant: ProductVariant },
  { rejectValue: ProductVariantResponse<null> }
>("product/addVariant", async ({ productId, variant }, { rejectWithValue }) => {
  try {
    const response = await addVariant(productId, variant);
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
      msg: "Lỗi thêm biến thể không thành công",
      status: 500,
    });
  }
});
