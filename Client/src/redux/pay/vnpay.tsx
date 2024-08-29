import { createAsyncThunk } from "@reduxjs/toolkit";
import { createOrder, VnPayment } from "../../services/pay/vnpay";

export const createOrderThunk = createAsyncThunk(
  "checkout/createOrder",
  async (orderData: any, { rejectWithValue }) => {
    try {
      const response = await createOrder(orderData);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const VnPaymentThunk = createAsyncThunk(
  "checkout/VnPayment",
  async () => {
    const response = await VnPayment();
    return response;
  }
);
