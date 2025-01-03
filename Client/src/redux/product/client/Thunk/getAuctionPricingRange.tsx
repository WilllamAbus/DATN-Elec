import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAuctionPricingRange } from "../../../../services/detailProductAuction/getAuctionPricingRange";
import { AuctionPricingRangeResponse } from "../../../../services/detailProductAuction/types/getAuctionPricingRange";

export const getAuctionPricingRangeThunk = createAsyncThunk<
  AuctionPricingRangeResponse,
  { slug: string },
  { rejectValue: string }
>(
  "auctionClient/getAuctionPricingRange",
  async ({ slug }, { rejectWithValue }) => {
    try {
      if (!slug) {
        return rejectWithValue("Slug là bắt buộc");
      }

      const response = await getAuctionPricingRange(slug);

      if (response.status === "success") {
        return response;
      } else {
        return rejectWithValue(response.msg || "Lỗi không xác định");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi không xác định");
    }
  }
);
