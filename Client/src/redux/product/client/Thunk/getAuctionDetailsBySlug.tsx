import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAuctionDetailsBySlug } from "../../../../services/detailProductAuction/getAuctionDetailsBySlug";
import { AuctionDetailsResponse } from "../../../../services/detailProductAuction/types/getAuctionDetailsBySlug";
export const getAuctionDetailsBySlugThunk = createAsyncThunk<
  AuctionDetailsResponse,
  { slug: string },
  { rejectValue: string }
>(
  "auctionClient/getAuctionDetails",
  async ({ slug }, { rejectWithValue }) => {
    try {
      if (!slug) {
        return rejectWithValue("Slug là bắt buộc");
      }

      const response = await getAuctionDetailsBySlug(slug);

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
