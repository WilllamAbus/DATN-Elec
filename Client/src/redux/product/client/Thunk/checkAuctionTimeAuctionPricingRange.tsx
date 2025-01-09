import { createAsyncThunk } from "@reduxjs/toolkit";
import { checkAuctionTimeAuctionPricingRange } from "../../../../services/detailProductAuction/checkAuctionTimeAuctionPricingRange";
import { CheckAuctionTimeAuctionPricingRangeResponse } from "../../../../services/detailProductAuction/types/checkAuctionTimeAuctionPricingRange";

export const checkAuctionTimeAuctionPricingRangeThunk = createAsyncThunk<
  CheckAuctionTimeAuctionPricingRangeResponse,
  string, 
  { rejectValue: { code: string; msg: string } }
>(
  "auctionClient/checkAuctionTimeAuctionPricingRange",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await checkAuctionTimeAuctionPricingRange(slug);
      return response;
    } catch (error: any) {
      return rejectWithValue({ code: error.code || "LOI_KHONG_XAC_DINH", msg: error.msg || "Lỗi không xác định" });
    }
  }
);
