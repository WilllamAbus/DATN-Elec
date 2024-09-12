import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { add } from "../Thunk/add";
import { ProductStateAdd, ApiResponse,ProductAdd } from "../types/add";
const initialState: ProductStateAdd = {
  products: [],
  status: "idle",
  error: null,
};

const addSlice = createSlice({
  name: "product/add",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(add.pending, (state) => {
        state.status = "loading";
      })
      .addCase(add.fulfilled, (state, action: PayloadAction<ApiResponse<ProductAdd>>) => {
        state.status = "success";
        if (action.payload.data) {
          state.products.push(action.payload.data);
        }
        state.error = null; 
        console.log(action.payload.msg);
      })
      .addCase(add.rejected, (state, action) => {
        state.status = "fail";
        const errorPayload = action.payload as ApiResponse<null>;
        state.error = errorPayload.msg || "Lỗi thêm hong có được";
        console.log(errorPayload.msg); 
      });
  },
});

export default addSlice.reducer;
