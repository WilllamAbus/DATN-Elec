

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllConditionShoppingThunk } from "../Thunk";
import { ConditionShopping,GetAllConditionShoppingResponse  } from "../../../../services/product_v2/client/types/getAllConditionShopping";

interface ConditionShoppingState {
  conditionShopping: ConditionShopping[];
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}

const initialState: ConditionShoppingState = {
  conditionShopping: [],
  status: "idle",
  error: null,
  isLoading: false,
};

const getAllConditionShoppingSlice = createSlice({
  name: "conditionShopping/getAllConditionShopping",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllConditionShoppingThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(
        getAllConditionShoppingThunk.fulfilled,
        (state, action: PayloadAction<GetAllConditionShoppingResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.conditionShopping = action.payload.conditionShopping;
        }
      )
      .addCase(getAllConditionShoppingThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = (action.payload as string) || "Lỗi không xác định";
      });
  },
});

export default getAllConditionShoppingSlice.reducer;
