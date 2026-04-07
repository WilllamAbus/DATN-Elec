import { createAsyncThunk } from "@reduxjs/toolkit";
import { VnPayment } from "../../services/pay/vnpay";

export const VnPaymentThunk = createAsyncThunk(
  "checkout/VnPayment",
  async () => {
    const response = await VnPayment();
    return response;
  }
);
