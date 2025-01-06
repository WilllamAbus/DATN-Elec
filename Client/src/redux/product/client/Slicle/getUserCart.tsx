import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUserCartThunk } from "../Thunk";
import { Cart, GetUserCartResponse } from "../../../../services/detailProductAuction/types/getUserCart";

interface UserCartState {
  cart: Cart | null;
  statusCart: number | null;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}

const initialState: UserCartState = {
  cart: null,
  statusCart: 0,
  status: "idle",
  error: null,
  isLoading: false,
};

const getUserCartSlice = createSlice({
  name: "userCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserCartThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getUserCartThunk.fulfilled,
        (state, action: PayloadAction<GetUserCartResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.cart = action.payload.cart || null;
          state.statusCart = action.payload.statusCart || null;
          state.error = null;
        }
      )
      .addCase(getUserCartThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || "Lỗi khi lấy giỏ hàng của người dùng";
      });
  },
});

export default getUserCartSlice.reducer;
