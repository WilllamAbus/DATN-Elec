import { createAsyncThunk } from "@reduxjs/toolkit";
import { enterAuctionPrice } from "../../../../services/detailProductAuction/enterAuctionPrice";
import { EnterAuctionPriceResponse } from "../../../../services/detailProductAuction/types/enterAuctionPriceResponse";

export const enterAuctionPriceThunk = createAsyncThunk<
  EnterAuctionPriceResponse,
  { slug: string; bidPrice: number },
  { rejectValue: EnterAuctionPriceResponse }
>(
  "productClient/enterAuctionPrice",
  async ({ slug, bidPrice }, { rejectWithValue }) => {
    try {
      const response = await enterAuctionPrice(slug, bidPrice);

      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response);
      }
    } catch (error: any) {
      return rejectWithValue({ msg: error.message || "Lỗi không xác định", success: false, err: 1, status: "fail", userId: null });
    }
  }
);
