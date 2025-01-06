import { createAsyncThunk } from "@reduxjs/toolkit";
import { getTop3HighestBidders } from "../../../../services/detailProductAuction/getTop3HighestBidders";
import { GetTop3HighestBidderResponse } from "../../../../services/detailProductAuction/types/getTop3HighestBidders";

export const getTop3HighestBiddersThunk = createAsyncThunk<
  GetTop3HighestBidderResponse,
  { slug: string },
  { rejectValue: string }
>(
  "auctionClient/getTop3HighestBidders",
  async ({ slug }, { rejectWithValue }) => {
    try {
      if (!slug) {
        return rejectWithValue("Slug là bắt buộc");
      }

      const response = await getTop3HighestBidders(slug);

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
