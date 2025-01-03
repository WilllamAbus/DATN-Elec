import { createAsyncThunk } from "@reduxjs/toolkit";
import { checkStatusAuctionPricingRange } from "../../../../services/detailProductAuction/checkStatusAuctionPricingRange";
import { CheckStatusAuctionPricingRangeResponse } from "../../../../services/detailProductAuction/types/checkStatusAuctionPricingRange";

export const checkStatusAuctionPricingRangeThunk = createAsyncThunk<
  CheckStatusAuctionPricingRangeResponse,
  { slug: string },
  { rejectValue: string }
>(
  "auctionClient/checkStatusAuctionPricingRange",
  async ({ slug }, { rejectWithValue }) => {
    try {
      if (!slug) {
        return rejectWithValue("Slug là bắt buộc");
      }

      const response = await checkStatusAuctionPricingRange(slug);

      if (response.status === "success") {
        return response;
      } else {
        return rejectWithValue(response.message || "Lỗi không xác định");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi không xác định");
    }
  }
);
