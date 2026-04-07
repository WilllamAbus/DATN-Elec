import { createAsyncThunk } from "@reduxjs/toolkit";
import { highBidderInformation } from "../../../../services/detailProductAuction/highBidderInformation";
import { HighBidderInformationResponse } from "../../../../services/detailProductAuction/types/highBidderInformation";

export const highBidderInformationThunk = createAsyncThunk<
  HighBidderInformationResponse,
  { slug: string },
  { rejectValue: string }
>(
  "auctionClient/highBidderInformation",
  async ({ slug }, { rejectWithValue }) => {
    try {
      if (!slug) {
        return rejectWithValue("Slug là bắt buộc");
      }

      const response = await highBidderInformation(slug);

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
