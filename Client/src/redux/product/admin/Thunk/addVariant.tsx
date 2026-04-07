import { createAsyncThunk } from "@reduxjs/toolkit";
import { addVariant } from "../../../../services/product_v2/admin";
import { ProductVariantResponse, ProductVariant,RESPONSE_MESSAGES, STATUS_CODES } from "../../../../services/product_v2/admin/types/addVariant"; 

export const addVariantThunk = createAsyncThunk<
  ProductVariantResponse,
  { productId: string; variant: ProductVariant },
  { rejectValue: ProductVariantResponse } 
>("product/addVariant", async ({ productId, variant }, { rejectWithValue }) => {
  try {
    const response = await addVariant(productId, variant);
    if (!response.success) {
      return rejectWithValue({
        success: false,
        err: response.err,
        msg: response.msg || RESPONSE_MESSAGES.VARIANT_ADD_ERROR, 
        status: response.status || STATUS_CODES.BAD_REQUEST, 
        variant: null, 
      });
    }
    return response;
  } catch (error) {
    return rejectWithValue({
      success: false,
      err: 1,
      msg: RESPONSE_MESSAGES.VARIANT_ADD_ERROR,
      status: STATUS_CODES.SERVER_ERROR, 
      variant: null, 
    });
  }
});
