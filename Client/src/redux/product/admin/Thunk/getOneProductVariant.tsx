import { createAsyncThunk } from "@reduxjs/toolkit";
import { ProductVariant, ApiResponse } from '../../../../services/product_v2/admin/types/editVariant';
import { getOneProductVariant } from "../../../../services/product_v2/admin/getOneProductVariant"; 

export const getOneProductVariantThunk = createAsyncThunk<ProductVariant, string, { rejectValue: string }>(
  "productVariant/getOneProductVariant",
  async (variantId: string, { rejectWithValue }) => {
    try {
      const response: ApiResponse = await getOneProductVariant(variantId);
      if (response.success) {
        const variantData = response.variant;
        if (variantData) {
          return variantData as ProductVariant; 
        } else {
          return rejectWithValue("Variant không tồn tại.");
        }
      } else {
        return rejectWithValue(response.msg);
      }
      
    } catch (error) {
      console.error("Error fetching variant:", error); // Log lỗi
      return rejectWithValue("Lỗi hệ thống");
    }
  }
);
