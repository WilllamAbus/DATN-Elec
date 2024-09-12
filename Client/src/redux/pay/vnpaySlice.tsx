import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VnPaymentThunk } from "./vnpay";
import { createOrderThunk } from "../order/orderThunks";
interface CheckoutState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: CheckoutState = {
  loading: false,
  error: null,
  success: false,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    resetState: (state) => {
      state.success = false;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrderThunk.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(
        createOrderThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload?.message || "Đã xảy ra lỗi";
        }
      )
      .addCase(VnPaymentThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(VnPaymentThunk.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(VnPaymentThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload?.message || "Đã xảy ra lỗi";
      });
  },
});

export const { resetState } = checkoutSlice.actions;
export default checkoutSlice.reducer;
