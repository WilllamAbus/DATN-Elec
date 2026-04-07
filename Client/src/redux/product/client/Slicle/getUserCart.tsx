import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUserCartThunk } from "../Thunk";
import { Cart, GetUserCartResponse } from "../../../../services/detailProductAuction/types/getUserCart";

interface UserCartState {
  cart: Cart | null;
  statusCart: number | null;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
  statusWarningTimeout: boolean;
  timeLimit: string | null;
  isBanned: boolean;
  statusAuction: string;
  message: string | null;
  warning: number;
  noteWarning: string | null;
}

const initialState: UserCartState = {
  cart: null,
  statusCart: 0,
  status: "idle",
  error: null,
  isLoading: false,
  statusWarningTimeout: false,
  timeLimit: null,
  isBanned: false,
  statusAuction: "active",
  message: null,
  warning: 0,
  noteWarning: null,
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
          state.statusWarningTimeout = action.payload.statusWarningTimeout || false;
          state.timeLimit = action.payload.timeLimit || null;
          state.isBanned = action.payload.isBanned || false;
          state.statusAuction = action.payload.statusAuction || "active";
          state.message = action.payload.message || null;
          state.warning = action.payload.warning || 0;
          state.noteWarning = action.payload.noteWarning || null;
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

