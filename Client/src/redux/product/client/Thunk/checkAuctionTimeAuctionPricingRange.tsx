import { createAsyncThunk } from "@reduxjs/toolkit";
import { checkAuctionTimeAuctionPricingRange } from "../../../../services/detailProductAuction/checkAuctionTimeAuctionPricingRange";
import { CheckAuctionTimeAuctionPricingRangeResponse } from "../../../../services/detailProductAuction/types/checkAuctionTimeAuctionPricingRange";

export const checkAuctionTimeAuctionPricingRangeThunk = createAsyncThunk<
  CheckAuctionTimeAuctionPricingRangeResponse,
  string,
  { rejectValue: string }
>(
  "auctionClient/checkAuctionTimeAuctionPricingRange",
  async (slug, { rejectWithValue }) => {
    try {
      if (!slug) {
        return rejectWithValue("Slug là bắt buộc");
      }

      const response = await checkAuctionTimeAuctionPricingRange(slug);

      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.msg || "Lỗi không xác định");
      }
    } catch (error: any) {
      console.error('Error fetching auction pricing range:', error);
      return rejectWithValue(error.message || "Lỗi không xác định");
    }
  }
);
