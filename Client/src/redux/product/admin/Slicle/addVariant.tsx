import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addVariantThunk } from "../Thunk";
import {
  initialVariantState,
  ProductVariantResponse,
  RESPONSE_MESSAGES,
} from "../../../../services/product_v2/admin/types/addVariant";

const addVariantSlice = createSlice({
  name: "product/addVariant",
  initialState: initialVariantState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addVariantThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true; 
      })
      .addCase(
        addVariantThunk.fulfilled,
        (state, action: PayloadAction<ProductVariantResponse>) => {
          state.status = "success";
          state.isLoading = false; 
          
          if (action.payload.variant) {
            state.variants.push(action.payload.variant);
          }
          state.error = null;
          console.log(RESPONSE_MESSAGES.VARIANT_ADDED_SUCCESS); 
        }
      )
      .addCase(addVariantThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false; 
        
        const errorPayload = action.payload as { msg: string } || { msg: RESPONSE_MESSAGES.VARIANT_ADD_ERROR };
        state.error = errorPayload.msg || RESPONSE_MESSAGES.VARIANT_ADD_ERROR;
        console.log(state.error);
      });
  },
});

export default addVariantSlice.reducer;
