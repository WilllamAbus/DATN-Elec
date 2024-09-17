import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllConditionShopping } from "../../../../services/product_v2/client/getAllConditionShopping";
import { GetAllConditionShoppingResponse, } from "../../../../services/product_v2/client/types/getAllConditionShopping";

export const getAllConditionShoppingThunk = createAsyncThunk<
  GetAllConditionShoppingResponse,
  void,
  { rejectValue: string }
>("conditionShopping/getAllConditionShopping", async (_, { rejectWithValue }) => {
  try {
    const response = await getAllConditionShopping();
    if (response.success) {
      return response;
    } else {
      return rejectWithValue(response.msg);
    }
  } catch (error: any) {
    return rejectWithValue(error.message || "Lỗi không xác định");
  }
});
