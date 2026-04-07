import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetOneResponse,ProductAuction } from "../../../../services/productAuction/types/getone"; 
import { getOneProduct } from "../../../../services/productAuction/admin/getone";


export const getOneAuctionThunk = createAsyncThunk<ProductAuction, string, { rejectValue: string }>(
  "product/getone",
  async (id: string, { rejectWithValue }) => {
    try {
      const response: GetOneResponse = await getOneProduct(id);
      if (response.success) {
        return response.product as ProductAuction;
      } else {
        return rejectWithValue(response.msg);
      }
    } catch (error) {
      return rejectWithValue("Lỗi hệ thống");
    }
  }
);
